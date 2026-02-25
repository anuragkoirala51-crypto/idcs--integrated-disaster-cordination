'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useAppStore } from '@/store/useAppStore';
import { Crosshair, MapPin, Loader2, Layers } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom User Pulse Icon
const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Custom Heatmap Layer Component
function HeatLayer() {
  const map = useMap();
  const incidentReports = useAppStore(state => state.incidentReports);
  const [realMissions, setRealMissions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/datasets/parsed_disasters.json')
      .then(res => res.json())
      .then(data => setRealMissions(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!incidentReports.length && !realMissions.length) return;

    const heatPoints = [
      ...incidentReports.map(r => [
        r.location.lat,
        r.location.lng,
        r.intensity * 2.0
      ]),
      ...realMissions.map((r: any) => [
        r.lat,
        r.lng,
        0.5
      ])
    ] as [number, number, number][];

    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: 'cyan', 0.65: 'lime', 1: 'red' }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [incidentReports, realMissions, map]);

  return null;
}

// Auto-center map to bounds of all camps
function MapBounds() {
  const camps = useAppStore(state => state.camps);
  const map = useMap();

  useEffect(() => {
    if (camps.length > 0) {
      const bounds = L.latLngBounds(camps.map(c => [c.location.lat, c.location.lng]));
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
    }
  }, [camps, map]);

  return null;
}

// User Location Controller
function UserLocationController({ userLocation }: {
  userLocation: [number, number] | null
}) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 16, { duration: 2 });
    }
  }, [userLocation, map]);

  return null;
}

export default function MapClient() {
  const camps = useAppStore(state => state.camps);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full h-full relative group">
      {/* Cinematic HUD Elements Wrapper */}
      <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/5 rounded-xl overflow-hidden">
        <div className="scanline"></div>
      </div>

      {/* Repositioned Locate Me Button (Bottom Right) */}
      <div className="absolute bottom-16 right-6 z-[1001] flex flex-col space-y-2">
        <button
          onClick={handleLocate}
          disabled={isLocating}
          className="p-4 bg-indigo-600/90 backdrop-blur-md neo-btn text-white rounded-2xl hover:text-powder flex items-center justify-center group/btn"
          title="Locate Me"
        >
          {isLocating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Crosshair className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-500" />
          )}
          <div className="absolute right-full mr-3 px-3 py-1 bg-black/80 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
            Locate Position
          </div>
        </button>
      </div>

      <MapContainer
        center={[26.1388, 91.6625]}
        zoom={14}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-xl overflow-hidden shadow-2xl grayscale-[0.1] contrast-[1.1]"
        scrollWheelZoom={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Tactical Dark">
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <HeatLayer />
        <MapBounds />
        <UserLocationController userLocation={userLocation} />

        {userLocation && (
          <Marker position={userLocation} icon={UserIcon}>
            <Popup className="custom-popup">
              <div className="p-2 text-center">
                <p className="text-[10px] font-black text-powder uppercase tracking-widest mb-1">Your Live Location</p>
                <p className="text-xs font-mono text-white">
                  {userLocation[0].toFixed(4)}°N, {userLocation[1].toFixed(4)}°E
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {camps.map(camp => (
          <Marker key={camp.id} position={[camp.location.lat, camp.location.lng]}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-base text-white border-b border-white/10 pb-1 mb-2">{camp.name}</h3>
                <div className="space-y-1.5">
                  <p className="text-xs flex justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <span className={camp.status === 'Over Capacity' ? 'text-red-400 font-black' : 'text-powder font-black'}>{camp.status}</span>
                  </p>
                  <p className="text-xs flex justify-between">
                    <span className="text-neutral-400">Capacity:</span>
                    <span className="text-white font-mono">{Math.round((camp.currentOccupancy / camp.capacity) * 100)}%</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Viewport HUD */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Heat: Active</span>
          </div>
          <div className="w-[1px] h-3 bg-neutral-700"></div>
          {userLocation ? (
            <div className="flex items-center space-x-2">
              <MapPin className="w-2 h-2 text-powder animate-pulse" />
              <span className="text-[8px] font-black text-powder uppercase tracking-widest">
                GPS: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Layers className="w-2 h-2 text-neutral-500" />
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter italic">Multi-View Hub</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
