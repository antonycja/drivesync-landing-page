"""
Generate SADC-standard road sign SVGs for K53 learner's test.
Colors from official SADC signs: red #e20a16, yellow #ffd70a, blue #003DA5
"""
import os

OUT = "public/signs"
os.makedirs(OUT, exist_ok=True)

SKIP = {"stop.svg", "yield.svg", "no_entry.svg", "speed_60.svg", "speed_100.svg", "w102.svg", "w105.svg"}

def write(name, svg_content):
    if name in SKIP:
        print(f"  Skipped {name} (official)")
        return
    with open(f"{OUT}/{name}", "w") as f:
        f.write(svg_content)
    print(f"  Created {name}")

# ── W104 – T-intersection ahead ─────────────────────────────────────────────
# Red triangle (SADC standard), white inner triangle, black T symbol
write("w104.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 229 200" width="229" height="200">
  <!-- Outer red triangle with rounded stroke -->
  <polygon points="114.3,6.7 222.2,193.1 6.5,193.1" fill="#e20a16" stroke="#e20a16" stroke-width="13" stroke-linejoin="round"/>
  <!-- White inner triangle -->
  <polygon points="114.3,33.2 29.7,179.9 199.0,179.9" fill="#ffffff"/>
  <!-- Black T symbol: horizontal bar top, vertical bar down -->
  <rect x="78" y="100" width="72" height="14" fill="#000000"/>
  <rect x="107" y="114" width="14" height="52" fill="#000000"/>
</svg>''')

# ── Turn left mandatory (MS-LT) ──────────────────────────────────────────────
# Blue circle, white curved arrow turning left
write("turn_left.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="96" fill="#003DA5"/>
  <!-- White turn-left arrow: shaft goes up then bends left, head points left -->
  <path d="M 118,155 L 118,88 Q 118,62 92,62 L 68,62"
        fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Arrowhead pointing left -->
  <polygon points="52,62 82,44 82,80" fill="#ffffff"/>
</svg>''')

# ── Keep left mandatory (ES186 / R214) ──────────────────────────────────────
# Blue circle, white arrow pointing down-left (diagonal lane arrow)
write("keep_left.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="96" fill="#003DA5"/>
  <!-- Diagonal down-left arrow -->
  <line x1="135" y1="65" x2="68" y2="132" stroke="#ffffff" stroke-width="22" stroke-linecap="round"/>
  <!-- Arrowhead pointing down-left -->
  <polygon points="55,145 58,108 92,142" fill="#ffffff"/>
  <!-- Horizontal base bar at bottom left -->
  <line x1="42" y1="155" x2="90" y2="155" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
</svg>''')

# ── Yield to oncoming / width restriction (RR101) ───────────────────────────
# White circle, red border, red up arrow + black down arrow
write("yield_to_oncoming.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="96" fill="#ffffff" stroke="#e20a16" stroke-width="10"/>
  <!-- Red upward arrow (you must yield) -->
  <polygon points="80,38 100,18 120,38" fill="#e20a16"/>
  <rect x="88" y="38" width="24" height="60" fill="#e20a16"/>
  <!-- Black downward arrow (oncoming has priority) -->
  <polygon points="80,162 100,182 120,162" fill="#000000"/>
  <rect x="88" y="102" width="24" height="60" fill="#000000"/>
</svg>''')

# ── No overtaking by goods vehicles (RR3) ───────────────────────────────────
# White circle, red border, two truck silhouettes, red diagonal bar
write("no_overtaking_trucks.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="96" fill="#ffffff" stroke="#e20a16" stroke-width="10"/>
  <!-- Left truck (black/dark) -->
  <rect x="18" y="72" width="52" height="32" rx="3" fill="#333333"/>
  <rect x="18" y="68" width="32" height="20" rx="2" fill="#555555"/>
  <circle cx="32" cy="108" r="8" fill="#111111"/>
  <circle cx="58" cy="108" r="8" fill="#111111"/>
  <!-- Right truck (lighter/behind) -->
  <rect x="88" y="75" width="52" height="28" rx="3" fill="#888888"/>
  <rect x="88" y="71" width="32" height="18" rx="2" fill="#aaaaaa"/>
  <circle cx="102" cy="107" r="7" fill="#666666"/>
  <circle cx="128" cy="107" r="7" fill="#666666"/>
  <!-- Red diagonal strike bar -->
  <line x1="22" y1="22" x2="178" y2="178" stroke="#e20a16" stroke-width="14" stroke-linecap="round"/>
</svg>''')

# ── Motorcycle mandatory lane (BR301) ────────────────────────────────────────
# Blue rectangle, white motorcycle symbol, R in diamond
write("motorcycle_r.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" width="160" height="180">
  <rect x="0" y="0" width="160" height="180" rx="8" fill="#003DA5"/>
  <rect x="0" y="0" width="160" height="180" rx="8" fill="none" stroke="#ffffff" stroke-width="5"/>
  <!-- Motorcycle: two wheels + frame + handlebars + rider silhouette -->
  <!-- Rear wheel -->
  <circle cx="48" cy="100" r="28" fill="none" stroke="#ffffff" stroke-width="7"/>
  <!-- Front wheel -->
  <circle cx="120" cy="100" r="24" fill="none" stroke="#ffffff" stroke-width="7"/>
  <!-- Frame -->
  <line x1="48" y1="100" x2="84" y2="65" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <line x1="84" y1="65" x2="120" y2="76" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <!-- Fork/front strut -->
  <line x1="100" y1="60" x2="120" y2="100" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <!-- Engine block -->
  <rect x="64" y="78" width="30" height="22" rx="4" fill="#003DA5" stroke="#ffffff" stroke-width="5"/>
  <!-- Handlebars -->
  <line x1="95" y1="60" x2="112" y2="60" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <!-- Seat/rider hump -->
  <path d="M 68,65 Q 80,52 92,65" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <!-- R label at bottom -->
  <text x="80" y="155" font-size="28" fill="#ffffff" text-anchor="middle" font-weight="bold"
        font-family="Arial,Helvetica,sans-serif">R</text>
</svg>''')

# ── GS403 – Lanes merging without reduction ──────────────────────────────────
# White rect, red border, 4 upward arrows with leftmost merging diagonally
write("gs403.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="200" height="220">
  <rect x="2" y="2" width="196" height="196" rx="6" fill="#ffffff" stroke="#e20a16" stroke-width="6"/>
  <!-- 3 straight upward arrows -->
  <line x1="80" y1="180" x2="80" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="80,22 68,48 92,48" fill="#333333"/>
  <line x1="115" y1="180" x2="115" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="115,22 103,48 127,48" fill="#333333"/>
  <line x1="150" y1="180" x2="150" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="150,22 138,48 162,48" fill="#333333"/>
  <!-- Diagonal merging arrow from left joining leftmost straight -->
  <path d="M 32,180 L 80,80" fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Code label -->
  <text x="100" y="212" font-size="13" fill="#555555" text-anchor="middle" font-family="Arial,sans-serif">GS 403</text>
</svg>''')

# ── R320 – High Occupancy / Bus Lane ─────────────────────────────────────────
write("r320.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect x="2" y="2" width="156" height="156" rx="8" fill="#003DA5" stroke="#ffffff" stroke-width="5"/>
  <!-- Diamond outline -->
  <polygon points="80,20 120,60 80,100 40,60" fill="none" stroke="#ffffff" stroke-width="5"/>
  <!-- Number inside diamond -->
  <text x="80" y="66" font-size="24" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">12</text>
  <!-- R below -->
  <text x="80" y="130" font-size="34" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">R</text>
</svg>''')

# ── R320-P – High Occupancy Parking Lane ─────────────────────────────────────
write("r320_p.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect x="2" y="2" width="156" height="156" rx="8" fill="#003DA5" stroke="#ffffff" stroke-width="5"/>
  <!-- Large P left -->
  <text x="55" y="88" font-size="80" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">P</text>
  <!-- Diamond outline top-right -->
  <polygon points="118,16 142,40 118,64 94,40" fill="none" stroke="#ffffff" stroke-width="4"/>
  <!-- Number in diamond -->
  <text x="118" y="42" font-size="16" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">12</text>
</svg>''')

# ── GF8 – Freeway Service Station sign ───────────────────────────────────────
write("gf8.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <rect x="0" y="0" width="200" height="160" rx="8" fill="#6b3a2a"/>
  <rect x="0" y="0" width="200" height="160" rx="8" fill="none" stroke="#4a2818" stroke-width="4"/>
  <!-- Header text -->
  <text x="100" y="22" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold"
        font-family="Arial,sans-serif">HEIDELBERG</text>
  <!-- Divider -->
  <line x1="10" y1="30" x2="190" y2="30" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/>
  <!-- Row 1: fuel + towing icons -->
  <text x="18" y="52" font-size="14" fill="#ffffff" font-family="Arial,sans-serif">59</text>
  <!-- Fuel pump icon -->
  <rect x="45" y="38" width="12" height="16" rx="1" fill="#ffd70a"/>
  <rect x="49" y="34" width="4" height="6" rx="1" fill="#ffd70a"/>
  <rect x="56" y="40" width="5" height="10" rx="2" fill="#ffd70a"/>
  <!-- Tow truck icon (simple) -->
  <rect x="68" y="40" width="24" height="14" rx="2" fill="#ffffff"/>
  <circle cx="74" cy="56" r="4" fill="#ffffff"/>
  <circle cx="86" cy="56" r="4" fill="#ffffff"/>
  <!-- km label -->
  <text x="182" y="52" font-size="12" fill="#ffffff" text-anchor="end" font-family="Arial,sans-serif">2.5km</text>
  <!-- Row 2: parking + hospital -->
  <text x="18" y="88" font-size="14" fill="#ffffff" font-family="Arial,sans-serif">66</text>
  <circle cx="60" cy="80" r="12" fill="#003DA5"/>
  <text x="60" y="84" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold"
        font-family="Arial,sans-serif">P</text>
  <circle cx="88" cy="80" r="12" fill="#e20a16"/>
  <text x="88" y="84" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold"
        font-family="Arial,sans-serif">H</text>
  <text x="182" y="88" font-size="12" fill="#ffffff" text-anchor="end" font-family="Arial,sans-serif">9.5km</text>
  <!-- Row 3: accommodation -->
  <text x="18" y="124" font-size="14" fill="#ffffff" font-family="Arial,sans-serif">70</text>
  <rect x="46" y="110" width="28" height="18" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
  <rect x="54" y="106" width="12" height="8" rx="1" fill="#ffffff"/>
  <text x="182" y="124" font-size="12" fill="#ffffff" text-anchor="end" font-family="Arial,sans-serif">13.5km</text>
  <!-- GF8 footer label -->
  <text x="100" y="150" font-size="11" fill="#dddddd" text-anchor="middle" font-family="Arial,sans-serif">GF 8</text>
</svg>''')

# ── GF12 – Emergency SOS Call Station ────────────────────────────────────────
write("gf12.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="160" height="200">
  <rect x="0" y="0" width="160" height="200" rx="8" fill="#6b3a2a"/>
  <rect x="0" y="0" width="160" height="200" rx="8" fill="none" stroke="#4a2818" stroke-width="4"/>
  <!-- Yellow circle with phone + SOS -->
  <circle cx="80" cy="80" r="52" fill="#ffd70a"/>
  <!-- Phone handset (simplified) -->
  <path d="M 58,58 Q 52,72 62,84 Q 74,96 88,90 L 80,80 Q 76,82 72,78 Q 68,74 70,68 Z"
        fill="#333333" stroke="none"/>
  <!-- SOS text -->
  <text x="80" y="74" font-size="20" fill="#000000" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">SOS</text>
  <!-- Distance text -->
  <text x="80" y="148" font-size="20" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">500m</text>
  <!-- GF12 label -->
  <text x="80" y="182" font-size="13" fill="#dddddd" text-anchor="middle"
        font-family="Arial,sans-serif">GF 12</text>
</svg>''')

# ── GA4 – Freeway Exit Direction ──────────────────────────────────────────────
write("ga4.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120">
  <rect x="0" y="0" width="180" height="120" rx="8" fill="#003DA5"/>
  <!-- Route number box -->
  <rect x="10" y="10" width="60" height="30" rx="3" fill="none" stroke="#ffffff" stroke-width="3"/>
  <text x="40" y="29" font-size="17" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">N12</text>
  <!-- EXIT text -->
  <text x="130" y="29" font-size="14" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">EXIT</text>
  <!-- Large curved arrow pointing down-right (exit ramp) -->
  <path d="M 50,65 L 120,65 Q 145,65 145,88"
        fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Arrowhead pointing down -->
  <polygon points="145,108 126,82 164,82" fill="#ffffff"/>
</svg>''')

# ── GF527 – High Speed Exit 100m ─────────────────────────────────────────────
write("high_speed_exit.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" width="100" height="140">
  <rect x="0" y="0" width="100" height="140" rx="6" fill="#003DA5"/>
  <!-- White diagonal stripe (top-right to bottom-left, like exit lane delineator) -->
  <polygon points="100,0 100,80 40,140 0,140 0,100 65,0" fill="#ffffff"/>
  <!-- 100m text -->
  <text x="50" y="118" font-size="13" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">100m</text>
</svg>''')

# ── TR301 – Traffic Camera ────────────────────────────────────────────────────
write("traffic_camera.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 190" width="160" height="190">
  <rect x="2" y="2" width="156" height="186" rx="6" fill="#ffffff" stroke="#333333" stroke-width="4"/>
  <!-- Traffic light housing -->
  <rect x="42" y="15" width="42" height="100" rx="8" fill="#222222"/>
  <!-- Lights -->
  <circle cx="63" cy="38" r="14" fill="#e20a16"/>
  <circle cx="63" cy="65" r="14" fill="#444444"/>
  <circle cx="63" cy="92" r="14" fill="#444444"/>
  <!-- Camera body -->
  <rect x="96" y="75" width="42" height="24" rx="4" fill="#555555"/>
  <!-- Camera lens -->
  <circle cx="138" cy="87" r="10" fill="#222222"/>
  <circle cx="138" cy="87" r="5" fill="#888888"/>
  <!-- Tripod legs -->
  <line x1="115" y1="99" x2="105" y2="130" stroke="#555555" stroke-width="4" stroke-linecap="round"/>
  <line x1="115" y1="99" x2="125" y2="130" stroke="#555555" stroke-width="4" stroke-linecap="round"/>
  <line x1="105" y1="130" x2="125" y2="130" stroke="#555555" stroke-width="3" stroke-linecap="round"/>
  <!-- Label -->
  <text x="80" y="158" font-size="12" fill="#333333" text-anchor="middle"
        font-weight="bold" font-family="Arial,sans-serif">TRAFFIC CAMERA</text>
  <text x="80" y="175" font-size="10" fill="#666666" text-anchor="middle"
        font-family="Arial,sans-serif">TR 301</text>
</svg>''')

# ── ALT-A – Alternative Route ─────────────────────────────────────────────────
write("alternative_route.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 110" width="240" height="110">
  <rect x="0" y="0" width="240" height="110" rx="8" fill="#007a3d"/>
  <rect x="0" y="0" width="240" height="110" rx="8" fill="none" stroke="#005a2b" stroke-width="4"/>
  <!-- Yellow circle with A -->
  <circle cx="55" cy="55" r="38" fill="#ffd70a"/>
  <text x="55" y="60" font-size="38" fill="#000000" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">A</text>
  <!-- Horizontal arrow pointing right -->
  <line x1="108" y1="55" x2="190" y2="55" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  <polygon points="210,55 182,39 182,71" fill="#ffffff"/>
</svg>''')

# ── N-BRIDGE – National Road Bridge Sign ──────────────────────────────────────
write("n12_bridge.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="160" height="200">
  <rect x="0" y="0" width="160" height="200" rx="8" fill="#003DA5"/>
  <rect x="0" y="0" width="160" height="200" rx="8" fill="none" stroke="#002070" stroke-width="4"/>
  <!-- Route number box -->
  <rect x="10" y="10" width="140" height="36" rx="4" fill="none" stroke="#ffffff" stroke-width="3"/>
  <text x="80" y="32" font-size="22" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">N12</text>
  <!-- Bridge arch -->
  <path d="M 22,110 Q 80,58 138,110" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <!-- Bridge deck -->
  <rect x="22" y="108" width="116" height="10" rx="2" fill="#ffffff"/>
  <!-- Left pillar -->
  <rect x="22" y="110" width="14" height="50" fill="#ffffff"/>
  <!-- Right pillar -->
  <rect x="124" y="110" width="14" height="50" fill="#ffffff"/>
  <!-- Up arrow -->
  <line x1="80" y1="170" x2="80" y2="188" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <polygon points="80,152 66,176 94,176" fill="#ffffff"/>
</svg>''')

# ── CHEVRON – Hazard Boards ────────────────────────────────────────────────────
write("chevrons.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <rect x="0" y="0" width="200" height="100" rx="4" fill="#ffffff" stroke="#333333" stroke-width="3"/>
  <!-- Alternating red and white chevron stripes (left to right) -->
  <polygon points="0,0 40,0 120,100 80,100" fill="#e20a16"/>
  <polygon points="40,0 80,0 160,100 120,100" fill="#ffffff"/>
  <polygon points="80,0 120,0 200,100 160,100" fill="#e20a16"/>
  <polygon points="120,0 160,0 200,60 200,100" fill="#ffffff"/>
  <polygon points="160,0 200,0 200,60" fill="#e20a16"/>
  <!-- Outer border again on top -->
  <rect x="0" y="0" width="200" height="100" rx="4" fill="none" stroke="#333333" stroke-width="3"/>
</svg>''')

# ── Delivery vehicle must turn left (Q20) ────────────────────────────────────
write("delivery_turn_left.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140" width="260" height="140">
  <!-- Blue mandatory turn-left circle -->
  <circle cx="70" cy="70" r="66" fill="#003DA5"/>
  <!-- Turn-left arrow -->
  <path d="M 88,112 L 88,55 Q 88,32 64,32 L 42,32"
        fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="26,32 54,15 54,49" fill="#ffffff"/>
  <!-- Truck silhouette to the right -->
  <!-- Cab -->
  <rect x="155" y="50" width="48" height="38" rx="4" fill="#444444"/>
  <!-- Windshield -->
  <rect x="160" y="54" width="20" height="18" rx="2" fill="#88bbdd"/>
  <!-- Body/cargo -->
  <rect x="155" y="42" width="90" height="46" rx="2" fill="#666666"/>
  <!-- Wheels -->
  <circle cx="172" cy="96" r="12" fill="#222222"/>
  <circle cx="172" cy="96" r="5" fill="#888888"/>
  <circle cx="222" cy="96" r="12" fill="#222222"/>
  <circle cx="222" cy="96" r="5" fill="#888888"/>
</svg>''')

# ── Lane addition (yellow, merge from left) ──────────────────────────────────
write("lane_addition.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="2" y="2" width="196" height="196" rx="8" fill="#ffd70a" stroke="#cc8800" stroke-width="4"/>
  <!-- Two straight upward arrows (right lanes) -->
  <line x1="110" y1="175" x2="110" y2="50" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
  <polygon points="110,28 96,58 124,58" fill="#000000"/>
  <line x1="150" y1="175" x2="150" y2="50" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
  <polygon points="150,28 136,58 164,58" fill="#000000"/>
  <!-- Diagonal arrow from bottom-left merging into left straight arrow -->
  <path d="M 40,175 Q 40,130 75,100 Q 95,82 110,65"
        fill="none" stroke="#000000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''')

# ── T-junction information sign (green + red header) ─────────────────────────
write("t_junction_info.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" width="160" height="170">
  <rect x="0" y="0" width="160" height="170" rx="8" fill="#007a3d"/>
  <!-- Red header band -->
  <rect x="0" y="0" width="160" height="36" rx="8" fill="#e20a16"/>
  <rect x="0" y="22" width="160" height="14" fill="#e20a16"/>
  <text x="80" y="22" font-size="16" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">T-JUNCTION</text>
  <!-- Road diagram: T shape, white roads on green -->
  <!-- Horizontal road -->
  <rect x="20" y="70" width="120" height="28" rx="4" fill="#ffffff"/>
  <!-- Vertical road coming from bottom -->
  <rect x="66" y="98" width="28" height="58" rx="0" fill="#ffffff"/>
  <!-- Arrows: left + right + down (up?) -->
  <polygon points="30,84 16,84 26,72 26,96" fill="#007a3d"/>
  <polygon points="130,84 144,84 134,72 134,96" fill="#007a3d"/>
</svg>''')

# ── Railway crossing X road marking ──────────────────────────────────────────
write("railway_x.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <!-- Grey road surface -->
  <rect x="0" y="0" width="200" height="200" fill="#999999"/>
  <!-- Lighter road markings area -->
  <rect x="60" y="0" width="80" height="200" fill="#bbbbbb"/>
  <!-- White lane centre line (dashed) -->
  <line x1="100" y1="0" x2="100" y2="90" stroke="#ffffff" stroke-width="4" stroke-dasharray="12,10"/>
  <line x1="100" y1="110" x2="100" y2="200" stroke="#ffffff" stroke-width="4" stroke-dasharray="12,10"/>
  <!-- X crossing markings (yellow with white outline) -->
  <line x1="30" y1="30" x2="170" y2="170" stroke="#ffffff" stroke-width="14" stroke-linecap="square"/>
  <line x1="170" y1="30" x2="30" y2="170" stroke="#ffffff" stroke-width="14" stroke-linecap="square"/>
  <line x1="30" y1="30" x2="170" y2="170" stroke="#ffd70a" stroke-width="8" stroke-linecap="square"/>
  <line x1="170" y1="30" x2="30" y2="170" stroke="#ffd70a" stroke-width="8" stroke-linecap="square"/>
</svg>''')

# ── Traffic light with flashing red left arrow ────────────────────────────────
write("traffic_light_arrow.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <!-- Traffic light housing -->
  <rect x="30" y="8" width="60" height="130" rx="10" fill="#222222"/>
  <!-- Top light: red with left arrow -->
  <circle cx="60" cy="38" r="20" fill="#e20a16"/>
  <!-- Left arrow in red light -->
  <line x1="72" y1="38" x2="50" y2="38" stroke="#ff6666" stroke-width="6" stroke-linecap="round"/>
  <polygon points="42,38 54,30 54,46" fill="#ff6666"/>
  <!-- Middle light: amber (off) -->
  <circle cx="60" cy="73" r="20" fill="#555500"/>
  <!-- Bottom light: green (off) -->
  <circle cx="60" cy="108" r="20" fill="#005500"/>
  <!-- Post -->
  <rect x="54" y="138" width="12" height="30" fill="#555555"/>
  <!-- FLASHING label -->
  <text x="60" y="158" font-size="9" fill="#e20a16" text-anchor="middle"
        font-weight="bold" font-family="Arial,sans-serif">FLASHING</text>
</svg>''')

# ── Minimum speed right-hand lane – 60 km/h ───────────────────────────────────
write("min_speed_60.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <rect x="2" y="2" width="196" height="156" rx="6" fill="#f0f0f0" stroke="#cccccc" stroke-width="3"/>
  <!-- Two upward arrows on left half -->
  <line x1="60" y1="140" x2="60" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="60,22 46,50 74,50" fill="#333333"/>
  <line x1="100" y1="140" x2="100" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="100,22 86,50 114,50" fill="#333333"/>
  <!-- Blue mandatory speed circle on right -->
  <circle cx="158" cy="82" r="35" fill="#ffffff" stroke="#003DA5" stroke-width="7"/>
  <text x="158" y="86" font-size="30" fill="#003DA5" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">60</text>
</svg>''')

# ── Minimum speed right-hand lane temporary – 80 km/h (yellow background) ────
write("min_speed_80_temp.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <rect x="2" y="2" width="196" height="156" rx="6" fill="#ffd70a" stroke="#cc8800" stroke-width="4"/>
  <!-- Two upward arrows -->
  <line x1="60" y1="140" x2="60" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="60,22 46,50 74,50" fill="#333333"/>
  <line x1="100" y1="140" x2="100" y2="40" stroke="#333333" stroke-width="8" stroke-linecap="round"/>
  <polygon points="100,22 86,50 114,50" fill="#333333"/>
  <!-- Red regulatory speed circle (temporary) -->
  <circle cx="158" cy="82" r="35" fill="#ffffff" stroke="#e20a16" stroke-width="7"/>
  <text x="158" y="86" font-size="28" fill="#000000" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">80</text>
</svg>''')

# ── Lane reduction road marking ────────────────────────────────────────────────
write("lane_reduction.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170" width="200" height="170">
  <!-- Road surface -->
  <rect x="0" y="0" width="200" height="170" fill="#888888"/>
  <!-- Road background slightly lighter for the lanes -->
  <rect x="20" y="0" width="160" height="170" fill="#999999"/>
  <!-- Dashed white lane lines for 3 lanes at top -->
  <line x1="75" y1="0" x2="75" y2="80" stroke="#ffffff" stroke-width="3" stroke-dasharray="16,12"/>
  <line x1="125" y1="0" x2="125" y2="50" stroke="#ffffff" stroke-width="3" stroke-dasharray="16,12"/>
  <!-- Yellow merge line (right lane disappearing) -->
  <path d="M 125,50 Q 125,90 85,110 Q 75,115 75,130" stroke="#ffd70a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Dashed white lane line continuing below merge -->
  <line x1="75" y1="130" x2="75" y2="170" stroke="#ffffff" stroke-width="3" stroke-dasharray="16,12"/>
  <!-- Straight arrows in remaining lanes -->
  <line x1="42" y1="150" x2="42" y2="60" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <polygon points="42,42 32,66 52,66" fill="#ffffff"/>
  <line x1="158" y1="150" x2="158" y2="60" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <polygon points="158,42 148,66 168,66" fill="#ffffff"/>
</svg>''')

# ── No parking kerb marking ────────────────────────────────────────────────────
write("kerb_no_park.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <!-- Road surface -->
  <rect x="0" y="0" width="220" height="140" fill="#888888"/>
  <!-- Pavement/kerb block -->
  <rect x="0" y="100" width="220" height="40" fill="#cccccc"/>
  <!-- Kerb edge -->
  <rect x="0" y="96" width="220" height="8" fill="#aaaaaa"/>
  <!-- Yellow no-parking lines on kerb (double yellow zigzag) -->
  <polyline points="0,106 18,116 36,106 54,116 72,106 90,116 108,106 126,116 144,106 162,116 180,106 198,116 220,108"
            fill="none" stroke="#ffd70a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="0,122 18,132 36,122 54,132 72,122 90,132 108,122 126,132 144,122 162,132 180,122 198,132 220,124"
            fill="none" stroke="#ffd70a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- No parking arrow from road to kerb -->
  <line x1="110" y1="30" x2="110" y2="88" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <polygon points="110,96 98,74 122,74" fill="#ffffff"/>
  <!-- P with strike-through (no parking symbol) -->
  <circle cx="110" cy="45" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
  <text x="110" y="50" font-size="22" fill="#ffffff" text-anchor="middle"
        dominant-baseline="middle" font-weight="bold" font-family="Arial,sans-serif">P</text>
  <line x1="90" y1="28" x2="130" y2="62" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
</svg>''')

print("Generating SADC-standard road sign SVGs...")
print(f"\nDone! Files written to {OUT}/")
print("(Official signs skipped:", ", ".join(sorted(SKIP)), ")")
