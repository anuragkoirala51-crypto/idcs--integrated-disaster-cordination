const TelegramBot = require('node-telegram-bot-api');

const token = '8506019851:AAHDaDedcRGGmG0KdTWJAxWbzykv7jGG0dk';
const bot = new TelegramBot(token, { polling: true });

let activeChatId = null;
let intervalId = null;
let lastAlertType = null;

const mockNotices = [
    // Urban Flooding & Waterlogging
    "FLOOD ALERT\nAnil Nagar: Severe waterlogging reported; residents are advised to move valuables to upper floors immediately.",
    "WATERLOGGING\nNabin Nagar: Main roads submerged; avoid commuting through the inner lanes until water levels recede.",
    "FLASH FLOOD\nRG Baruah Road (Zoo Road): Flash flood alert; heavy traffic congestion near the Zoo gate due to knee-deep water.",
    "DRAINAGE OVERFLOW\nRajgarh Road: Drainage overflow confirmed; please secure all ground-floor electrical outlets.",
    "FLASH FLOOD\nLachit Nagar: Rapid water rise detected; pedestrians should avoid walking near open manholes and drains.",
    "WATERLOGGING\nTarun Nagar: Moderate flooding in Bye-lane 1 and 2; emergency dewatering pumps have been deployed.",
    "FLOOD ALERT\nRukminigaon: Bahini River overtopping; residents near the channel should prepare for immediate evacuation.",
    "WATERLOGGING\nGS Road (Christian Basti): Heavy water accumulation; expect significant delays on the stretch toward Dispur.",
    "FLASH FLOOD\nHatigaon: Flash floods reported in Sijubari; avoid low-lying residential areas near the Chariali.",
    "FLOOD ALERT\nChandmari: Waterlogging at the railway overbridge; commuters are advised to take the Bamunimaidan route.",
    "INUNDATION\nUlubari: Severe inundation at the GS Road junction; traffic is being diverted through Sarabbhati.",
    "WATERLOGGING\nSix Mile: Water accumulation near the flyover; drive with extreme caution to avoid engine stalls.",
    "FLASH FLOOD\nJayanagar: Flash flood alert; internal roads near the NRL petrol pump are currently inaccessible.",
    "FLOOD ALERT\nBeltola: Weekly market area flooded; residents are advised to stay indoors until the rain stops.",
    "WATERLOGGING\nBhetapara: Deep waterlogging near the Ghoramara intersection; avoid light vehicles in this zone.",
    "FLOOD ALERT\nGaneshguri: Market area submerged; shopkeepers are urged to secure inventory from rising water.",
    "FLOOD ALERT\nGeetanagar: Drainage blockage reported at Mother Teresa Road; expect temporary water stagnation.",
    "WATERLOGGING\nLakhimi Nagar: Rising water levels in the bye-lanes; move parked vehicles to higher ground immediately.",
    "FLASH FLOOD\nSurvey (Beltola): Flash flood warning; the main artery connecting to Basistha is under 2 feet of water.",
    "FLOOD ALERT\nBordoloi Nagar: High risk of flash flooding; stay away from the drain embankments during the downpour.",
    "WATERLOGGING\nDispur (Last Gate): Heavy waterlogging reported; avoid the Secretariat road due to rising levels.",
    "FLOOD ALERT\nBasisthapur: Water accumulation in Bylanes 1, 2, and 3; residents should remain vigilant of local drains.",
    "FLASH FLOOD\nWireless Area: Excessive runoff from Meghalaya hills; rapid water rise expected in the next 30 minutes.",
    "WATERLOGGING\nPanjabari: Moderate waterlogging near the Kalakshetra; use the main road for essential travel only.",
    "FLOOD ALERT\nBaghorbari: Low-lying areas are experiencing floods; relief teams are on standby for assistance.",
    "WATERLOGGING\nSatgaon: Water levels rising fast near the army camp; avoid the low-lying valley roads.",
    "FLOOD ALERT\nPatharquarry: Inundation reported; please check on elderly neighbors as water enters ground floors.",
    "FLASH FLOOD\nNarengi: Flash flood alert near the refinery gate; expect heavy silt and water on the road.",
    "WATERLOGGING\nNoonmati (Sector 1): Severe waterlogging; the pumping station is working at full capacity to drain the area.",
    "FLOOD ALERT\nBamunimaidan: Industrial area flooded; watch out for floating debris and hazardous materials in the water.",
    "WATERLOGGING\nSilpukhuri: Heavy water accumulation near the tank; avoid the Nabagraha road due to slippery conditions.",
    "FLOOD ALERT\nGuwahati Club: Major intersection flooded; expect traffic gridlock for the next two hours.",
    "INUNDATION\nUzan Bazar: Riverside roads reporting minor flooding; stay clear of the Brahmaputra ghats.",
    "WATERLOGGING\nPan Bazar: Waterlogging near the railway station; passengers are advised to allow extra travel time.",
    "FLOOD ALERT\nFancy Bazar: MG Road submerged; shopkeepers in the wholesale market should elevate their stock.",
    "WATERLOGGING\nAthgaon: Severe flooding near the kabristan; sewage backflow reported in residential buildings.",
    "FLOOD ALERT\nChatribari: Knee-deep water on the main road; avoid this route for any emergency medical transport.",
    "FLASH FLOOD\nBishnupur: Flash flood alert; heavy runoff from the Fatasil hills is flooding the lower colonies.",
    "FLOOD ALERT\nGopinath Nagar: Water entering residential compounds; disconnect all power lines to submerged pumps.",
    "FLOOD ALERT\nOdalguri: Localized flooding reported; residents are advised to stock up on clean drinking water.",
    "FLASH FLOOD\nBorjhar: Flash flood near the airport approach road; check with airlines for possible flight delays.",
    "WATERLOGGING\nAzara: Waterlogging in the market area; local administration is monitoring the Mora Bharalu level.",
    "INUNDATION\nDharapur: Road inundation reported; use the bypass to avoid the flooded sections of the highway.",
    "WATERLOGGING\nJalukbari: Severe waterlogging at the Gauhati University gate; students are advised to stay indoors.",
    "WATERLOGGING\nMaligaon (Chariali): Water accumulation under the flyover; traffic is moving at a snail's pace.",
    "FLOOD ALERT\nPandu: Low-lying railway colonies are flooded; relocation to the high-school camp is underway.",
    "INUNDATION\nAdabari: Bus terminal area submerged; expect cancellations of long-distance bus services.",
    "FLASH FLOOD\nKamakhya Gate: Flash flood alert; heavy water flow from the Nilachal hills onto the main road.",
    "FLOOD ALERT\nBharalumukh: Sluice gates closed due to high Brahmaputra level; expect rapid backwater flooding.",
    "INUNDATION\nSantipur: High risk of inundation; keep emergency kits ready as the Bharalu river nears the danger mark.",

    // Landslides & Hill Slopes
    "LANDSLIDE RISK\nKharguli Hills: High landslide risk; residents on the slope should evacuate to the Kharguli primary school.",
    "LANDSLIDE\nNoonmati (Hillside): Minor soil slip detected; avoid the hill-cutting zones during heavy rainfall.",
    "CRITICAL ALERT\nSunsali Hill: Critical alert; multiple landslide-prone spots identified, please relocate to safer zones.",
    "MUDSLIDE\nHengrabari Hill: Mudslide reported near the TV tower; road access to the upper colony is blocked.",
    "ROCKFALL RISK\nFatasil Ambari: High risk of rockfall; stay away from the steep cliffs behind the residential buildings.",
    "LANDSLIDE\nNarakasur Hill: Landslide warning; residents near the GMCH hill area should remain on high alert.",
    "SOIL EROSION\nKahilipara (Hill Side): Soil erosion detected near the 4th APBN gate; move to the designated shelters.",
    "LANDSLIDE\nNilachal Hill (Kamakhya): Landslide on the bypass road; vehicular movement to the temple is restricted.",
    "LANDSLIDE\nMaligaon (Swagat Hospital Hill): Active landslide reported; emergency crews are clearing the debris.",
    "SOIL EROSION\nNavagraha Hill: Trees uprooted due to soil saturation; avoid the winding roads toward the temple.",
    "LANDSLIDE\nKhanapara (Hillside): Landslide alert near the Meghalaya border; heavy runoff is destabilizing the slopes.",
    "STRUCTURAL DAMAGE\nKalapahar: Structural cracks reported in hill-top houses; immediate evacuation is recommended.",
    "LANDSLIDE\nSarania Hill: Minor landslide near the Gandhi Mandap road; drive with caution due to loose gravel.",
    "MUDFLOW\nGotanagar Hill: Slope failure reported; residents in the lower valley should watch for mudflow.",
    "LANDSLIDE RISK\nBonda (Sapaidang): Deadly landslide risk; all residents in unauthorized hill dwellings must move now.",
    "FLASH FLOOD\nGarbhanga Forest: Flash floods and mudslides on forest trails; trekking is strictly prohibited today.",
    "SOIL EROSION\nTetelia Hill: Heavy soil erosion; stay clear of the newly excavated hill areas for construction.",
    "ROCKFALL\nLankeshwar Hill: Rockfall alert; commuters on the NH stretch should watch for falling debris.",
    "LANDSLIDE\nPanikhaiti: Landslide reported near the police outpost; the road to Chandrapur is currently blocked.",
    "LANDSLIDE\nNarengi (Hill Side): Warning issued for residents near the refinery hills; watch for moving earth.",

    // Riverine Floods & Embankments
    "RIVER FLOOD\nBrahmaputra Bank (Uzan Bazar): River has crossed the danger mark; stay away from the embankment walls.",
    "SUSPENDED SERVICES\nNorth Guwahati: Ferry services suspended due to high turbulence and rising Brahmaputra levels.",
    "INUNDATION\nFancy Bazar (Ghat): River water entering the low-lying parking areas; move vehicles immediately.",
    "FLOODING\nSukreswar: Temple steps submerged; the district administration has banned entry to the riverfront.",
    "RISING WATERS\nPandu Port: Cargo operations halted as the river level reaches a 5-year high.",
    "RIVER FLOOD\nBasistha River: Rapid current reported; stay away from the riverbank during the monsoon peak.",
    "RIVER FLOOD\nBharalu River: River is overflowing its banks; residents of Fatasil and Bharalumukh must be ready.",
    "CRITICAL WATER LEVEL\nDeepor Beel: Water levels at critical stage; nearby villages should prepare for seasonal flooding.",
    "EVACUATION ALERT\nSilsako Beel: Evacuation alert for encroached areas; the wetland is expanding due to heavy rain.",
    "DRAINAGE BACKFLOW\nMora Bharalu: Drainage backflow alert; the sluice gates are being monitored for emergency opening.",

    // General Natural Disasters (Storms & Earthquakes)
    "THUNDERSTORM\nGuwahati City: Severe thunderstorm (Bordoisila) alert; seek shelter in permanent structures immediately.",
    "HIGH WIND\nAll Wards: High wind speed expected; stay away from hoardings, old trees, and power lines.",
    "POWER OUTAGE\nDispur: Power supply disconnected in flooded zones to prevent electrocution; stay away from poles.",
    "EARTHQUAKE\nGMC Area: Earthquake tremors felt; follow 'Drop, Cover, and Hold On' protocols immediately.",
    "AFTERSHOCK\nMachkhowa: Aftershock warning; residents of old/weak buildings should move to open spaces.",
    "ELECTRICAL HAZARD\nUlubari: Transformer explosion due to lightning; expect prolonged power outage in the area.",
    "FALLING DEBRIS\nZoo Road: High risk of falling branches; avoid parking cars under the large gulmohar trees.",
    "PUBLIC HEALTH\nGuwahati Metro: Public health alert; boil all drinking water to prevent waterborne diseases post-flood.",
    "MEDICAL ALERT\nBhangagarh: Medical emergency teams are on standby at GMCH for any disaster-related casualties.",
    "FIRE HAZARD\nPaltan Bazar: Fire hazard warning; ensure all electrical equipment is dry before restoring power.",
    "LOW VISIBILITY\nJalukbari: Heavy fog and rain reducing visibility; keep headlights on while driving on the bypass.",
    "HIGH WIND\nKhanapara: High wind alert; secure all loose tin roofs and construction materials on your property.",
    "WILDLIFE HAZARD\nBeltola: Snake bite awareness; be cautious of reptiles seeking dry ground in residential areas.",
    "HELPLINE ACTIVE\nEntire City: ASDMA emergency helpline 1070/1077 is active for all disaster-related rescues.",
    "CYCLONE ALERT\nChandrapur: Cyclone alert; residents in kucha houses should move to the community hall.",
    "ROAD BLOCKAGE\nSix Mile: Debris on the road from the flyover; municipal teams are working on clearing the path.",
    "SLIPPERY ROAD\nBharalumukh: Warning for residents near the railway tracks; mud is making the area slippery.",
    "FLASH FLOOD\nBonda: Flash flood in the local stream; avoid crossing the wooden bridges in the village.",
    "FLIGHT DELAYS\nGuwahati Airport: International flights diverted due to extreme weather conditions in the valley.",
    "DISASTER DRILL\nGuwahati Central: Disaster drill concluded; please follow official handles for real-time weather updates."
];

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/stop') {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        bot.sendMessage(chatId, 'Alerts paused. Send any message to resume.');
        return;
    }

    if (activeChatId !== chatId || !intervalId) {
        activeChatId = chatId;
        bot.sendMessage(chatId, 'IDCS Mock Alert Bot connected! Broadcasting automated disaster alerts for Guwahati region every 5 seconds without emojis. Consecutive alert types prevented. Send /stop to pause.');

        if (intervalId) clearInterval(intervalId);

        intervalId = setInterval(() => {
            let randomNotice = "";
            let newAlertType = "";
            let attempts = 0;

            // Loop until we find a notice that has a different category type
            // or if we've tried too many times (failsafe)
            do {
                randomNotice = mockNotices[Math.floor(Math.random() * mockNotices.length)];
                newAlertType = randomNotice.split('\\n')[0].trim();
                attempts++;
            } while (newAlertType === lastAlertType && attempts < 10);

            lastAlertType = newAlertType;

            bot.sendMessage(chatId, randomNotice);
        }, 5000);
        console.log(`Started sending alerts to chat ID: ${chatId}`);
    }
});

console.log("Telegram Bot updated with emoji-free randomized alerts (no consecutive duplicates). Running...");
