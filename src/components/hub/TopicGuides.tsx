"use client";

import { useState } from "react";

const topics = [
  {
    title: "Lighting & Visibility",
    icon: "💡",
    content: [
      "Head lamps, rear lamps, and number plate lights must be on between sunset and sunrise.",
      "Headlights must be on whenever visibility is less than 150 m (e.g. fog, heavy rain).",
      "When headlights are on and you can't see 100 m ahead due to rain, slow down.",
      "A parked vehicle between sunset and sunrise does NOT need lights if: within 10 m of a lit street lamp, parked off the roadway, or in a demarcated parking area.",
      "Hazard lights (emergency flashers) must be used when the vehicle is a hazard to other traffic.",
    ],
  },
  {
    title: "Speed Limits",
    icon: "🚗",
    content: [
      "Urban areas (within town limits): 60 km/h maximum.",
      "Rural roads outside urban areas: 100 km/h maximum.",
      "Freeways: 120 km/h maximum for light vehicles.",
      "Articulated vehicles with GCM exceeding 9 000 kg: 80 km/h maximum.",
      "Yellow-background speed signs indicate temporary restrictions.",
      "A minimum speed sign means you must drive at or faster than that speed in that lane.",
    ],
  },
  {
    title: "Right of Way & Intersections",
    icon: "⚡",
    content: [
      "At an uncontrolled intersection, yield to traffic approaching from your right.",
      "STOP sign: come to a complete stop before the stop line, then proceed when safe.",
      "YIELD sign: give way to traffic on the road you are entering — stop if necessary.",
      "Traffic lights: green = go, amber = stop if safe to do so, red = stop.",
      "A flashing red left-arrow at a red light means stop first, then proceed left when safe.",
      "When moving off from the side of the road, ensure it is completely safe first.",
    ],
  },
  {
    title: "Road Signs Categories",
    icon: "🚦",
    content: [
      "REGULATORY signs: red border, white background, black symbol. Must be obeyed by law.",
      "WARNING signs: red triangular border, white background, black symbol. Alerts to hazards.",
      "INFORMATION signs: blue or green background, white text/symbols. Provides guidance.",
      "TEMPORARY signs have the same legal force as permanent signs.",
      "Road markings: solid white = no crossing; broken white = crossing permitted when safe.",
      "Yellow kerb markings = no parking; red/yellow kerb = no stopping.",
    ],
  },
  {
    title: "Vehicle Controls",
    icon: "🔧",
    content: [
      "Control 1: Accelerator — controls engine speed and vehicle speed.",
      "Control 3: Rearview mirrors — used to monitor traffic around the vehicle.",
      "Control 4: Steering wheel — changes direction of the vehicle.",
      "Control 5: Clutch — used with the gear lever to change gears.",
      "Control 6: Gear lever — selects the appropriate gear.",
      "Control 7: Handbrake (parking brake) — must be applied when leaving vehicle unattended.",
      "Control 9: Foot brake (service brake) — slows or stops the vehicle.",
      "Stopping distance increases on wet roads, at higher speeds, and when loaded.",
    ],
  },
  {
    title: "Freeway Rules",
    icon: "🛣️",
    content: [
      "Pedal cycles (bicycles) are PROHIBITED on freeways.",
      "Learner drivers may NOT drive on a freeway.",
      "Maximum speed: 120 km/h for light vehicles.",
      "Minimum speed: as indicated by signs (e.g. 80 km/h in right-hand lane).",
      "No U-turns on freeways.",
      "Emergency stopping only on the hard shoulder.",
      "GA4/GA4(E) signs indicate exits. GF signs indicate service facilities.",
    ],
  },
  {
    title: "Following Distance & Overtaking",
    icon: "📏",
    content: [
      "Minimum safe following distance = 2-second rule (choose a fixed point, 2 sec between you and car ahead).",
      "Following distance increases on wet roads, at high speed, and with heavy vehicles.",
      "Overtaking is only allowed when it is safe and when road markings permit.",
      "Broken white centre line = overtaking permitted when safe.",
      "Solid white line = no overtaking (except to avoid an obstacle or turn off).",
      "You may NOT overtake at a STOP sign, YIELD sign, pedestrian crossing, or on a hill crest.",
    ],
  },
  {
    title: "Learner's Licence Rules",
    icon: "📋",
    content: [
      "A learner driver must be accompanied by a licensed driver with the same type of licence.",
      "Learner drivers may NOT drive on freeways.",
      "No passengers are allowed with a learner driver (except the supervising driver).",
      "The driving licence must be in your possession while driving.",
      "A person must not drive under the influence of alcohol or drugs.",
      "Blood alcohol limit for professional drivers and learners: 0.02 g/100ml. Ordinary: 0.05 g/100ml.",
    ],
  },
];

export default function TopicGuides() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {topics.map((topic, i) => (
        <div key={topic.title} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{topic.icon}</span>
              <span className="text-white font-medium">{topic.title}</span>
            </div>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-5 border-t border-slate-700">
              <ul className="mt-4 space-y-2">
                {topic.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
