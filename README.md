# Sun Launcher

My main menu on a sun dial: my apps on the sun, functions on the moon.
Private tool for my own phone. Static files only: no server, no login, no keys, no tracking.
Settings and favourites stay in this phone's browser storage. Photos from the camera stay on the phone.

Files: index.html (the app), manifest.webmanifest (name and icon for the home screen),
sw.js (offline copy), icon-*.png (app icons), tex-sun.jpg + tex-moon.jpg (sun and moon maps),
sky-<kind>-2.jpg ... (extra photos: Live photo picks one per day), sky-sunset.jpg (sunset sky photo for Settings > Sky picture),
sky-dawn.jpg + sky-day.jpg + sky-bluehour.jpg + sky-night.jpg (with sky-sunset.jpg: Settings > Sky > Live photo),
sky-overcast/rain/snow/snow-night/fog/storm.jpg (Live photo with Real weather),
stars-4k.jpg (NASA star map for Settings > Sky > Real stars, converted from starmap_2020_4k.exr),
saturn.jpg + saturn-ring.png (Saturn moon look),
earth-day.jpg + earth-night.jpg + earth-clouds.jpg (Earth start screen).

Live address after upload: https://harisonbd.github.io/sun-launcher/
Update: replace index.html, and change the 'sun-launcher-vN' name in sw.js to the next number.

Picture credits: Moon map from NASA/GSFC Scientific Visualization Studio, CGI Moon Kit (LRO data), public domain.
Sun map from Solar System Scope (https://www.solarsystemscope.com/textures/), based on NASA images, CC BY 4.0.
Sky photos (sunset, dawn, day, blue hour, night, overcast, rain, snow, fog, thunderstorm) from Unsplash / Pexels, free licence.
Saturn and ring maps from Solar System Scope (https://www.solarsystemscope.com/textures/), CC BY 4.0.
Earth from NASA Visible Earth (Blue Marble Next Generation October 2004 with topography and bathymetry;
Black Marble 2016 night lights; cloud map), public domain.
Real stars: NASA/Goddard Space Flight Center Scientific Visualization Studio (Deep Star Maps 2020, https://svs.gsfc.nasa.gov/4851). Gaia DR2: ESA/Gaia/DPAC.
Solar activity (Real sun today, Minimal sun, Clock dial): NOAA Space Weather Prediction Center (services.swpc.noaa.gov),
public data, asked every 3 hours while one of those screens is shown; nothing is sent except the request.
Weather (only when switched on in Settings): Open-Meteo.com (CC BY 4.0), asked with Vienna's fixed position only, every 30 minutes.
