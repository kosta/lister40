lister40.addArmy("Tau", { 
  "organization": [
    {"name": "HQ", "mincount": 1, "maxcount": 2},
    {"name": "Elite", "maxcount": 3},
    {"name": "Troops", "mincount": 1, "maxcount": 6},
    {"name": "Fast Attack", "maxcount": 3},
    {"name": "Heavy Support", "maxcount": 3},
  ],
  "equipment": [
    //Battlesuit Weapon Systems
    {"name": "Airbusting Fragmentation Projector", "points": 20, "flags": ["battlesuit weapon", "special issue"]},
    {"name": "Burst cannon", "points": 8, "flags": ["battlesuit weapon"]},
    {"name": "Burst cannon Twin-Linked", "points": 12, "flags": ["battlesuit weapon"]},
    {"name": "Cyclic Ion Blaser", "points": 15, "flags": ["battlesuit weapon", "special issue"]},
    {"name": "Flamer", "points": 12, "flags": ["battlesuit weapon"]},
    {"name": "Flamer Twin-Linked", "points": 18, "flags": ["battlesuit weapon"]},
    {"name": "Fusion blaster", "points": 12, "flags": ["battlesuit weapon"]},
    {"name": "Fusion blaster Twin-Linked", "points": 18, "flags": ["battlesuit weapon"]},
    {"name": "Missle pod", "points": 12, "flags": ["battlesuit weapon"]},
    {"name": "Missle pod Twin-Linked", "points": 18, "flags": ["battlesuit weapon"]},
    {"name": "Plasma rifle", "points": 20, "flags": ["battlesuit weapon"]},
    {"name": "Plasma rifle Twin-Linked", "points": 30, "flags": ["battlesuit weapon"]},
    //Battlesuit support systems
    {"name": "Advanced Stabilisation System", "points": 10, "flags": ["battlesuit support"]},
    {"name": "Blacksun Filter", "points": 3, "flags": ["battlesuit support"]},
    {"name": "Command & Control node", "points": 10, "flags": ["battlesuit support", "special issue"]},
    {"name": "Drone Controller", "points": 0, "flags": ["battlesuit support"]},
    {"name": "Multi-Tracker", "points": 5, "flags": ["battlesuit support"]},
    {"name": "Positional Relay", "points": 15, "flags": ["battlesuit support", "special issue"]},
    {"name": "Shield generator", "points": 20, "flags": ["battlesuit support"]},
    {"name": "Target lock", "points": 5, "flags": ["battlesuit support"]},
    {"name": "Targetting array", "points": 10, "flags": ["battlesuit support"]},
    {"name": "Vectored retro-thrusters", "points": 10, "flags": ["battlesuit support", "special issue"]},
    //Battelsuit Wargear
    {"name": "Bonding Knife", "points": 5, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Ejection System", "points": 15, "flags": ["battlesuit wargear", "special issue"]},
    {"name": "Failsafe detonator", "points": 15, "flags": ["battlesuit wargear", "special issue"]},
    {"name": "Gun Drone", "points": 10, "flags": ["battlesuit wargear"]},
    {"name": "Iridium Armor", "points": 20, "flags": ["battlesuit wargear"]},
    {"name": "Hard-wired blacksun filter", "points": 3, "count": 0, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Hard-wired drone controller", "points": 0, "count": 0, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Hard-wired multi-tracker", "points": 5, "count": 0, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Hard-wired target lock", "points": 5, "count": 0, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Marker drone", "points": 30, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Shield Drone", "points": 15, "flags": ["battlesuit wargear", "infantry"]},
    {"name": "Stimulant injector", "points": 10, "flags": ["battlesuit wargear", "special issue", "infantry"]},
    //Infantry Wargear (rest is already included above)
    {"name": "EMP Grenades", "points":  5, "flags": ["infantry"]},
    {"name": "Honour Blade", "points":  10, "flags": ["ethereal"]},
    //Vehicle Upgrade
    {"name": "Sensor spines", "points":  10, "flags": ["vehicle"]},
    {"name": "Targeting array", "points":  5, "flags": ["vehicle"]},
    {"name": "Multi-tracker", "points":  10, "flags": ["vehicle"]},
    {"name": "Blacksun Filter", "points":  5, "flags": ["vehicle"]},
    {"name": "Target Lock", "points":  5, "flags": ["vehicle"]},
    {"name": "Flechette Discharger", "points":  10, "flags": ["vehicle"]},
    {"name": "Disruption Pod", "points":  5, "flags": ["vehicle"]},
    {"name": "Decoy launchers", "points":  5, "flags": ["vehicle"]},
    {"name": "seeker missle", "points":  10, "maxcount": 2, "flags": ["vehicle"]},
  ],
  "units": [
    {"name": "Commander", "mincount": 1, "type": "HQ",
      "troops": [
        {"name": "Shas'o", "points": 75, "mincount": 1, "maxcount": 1,
          "upgrades": [{"name": "Shas'el", "points": 25},
            {"type": "equipment", "filter": ["+battlesuit support", "+battlesuit weapon"], "mincount": 3, "maxcount": 3},
            {"type": "equipment", "filter": ["+battlesuit wargear"]}
          ]},
        {"name": "Shas'vre", "points": 35, "mincount": 0, "maxcount": 2,
          "upgrades": [{"type": "equipment", "filter": ["+battlesuit support", "+battlesuit weapon"], "mincount": 3, "maxcount": 3},
            {"type": "equipment", "filter": ["+battlesuit wargear"]}
        ]} 
       ]
    },
    {"name": "Ethereal", "type": "HQ",
      "troops": [{"name": "Ethereal", "points": 50, 
        "upgrades": [{"type": "equipment", "filter": ["+infantry", "+ethereal"]}]},
      //TODO: Special Firewarrior unit
      ]
    },
    {"name": "XV8 'Crisis' Battlesuit Team", "type": "Elite",
      "troops": [{"name": "Shas'ui", "points": 25, "upgrades": [
        {"type": "equipment", "filter": ["+battlesuit support", "+battlesuit weapon"], "mincount": 3, "maxcount": 3},
        {"name": "Team Leader", "points": 5, "maxcount": 1, "upgrades": [
          {"type": "equipment", "filter": ["+battlesuit wargear", "-special issue"]},
          {"name": "Shas'vre", "points": 5, "maxcount": 1, "upgrades": [{"type": "equipment", "filter": ["+battlesuit wargear"]}]}
        ]}]}
      ]
    },
    {"name": "Stealth Team", "type": "Elite",
      "troops":[{"name": "Shas'ui", "points": 30, "notes": [
        "Either all or none select wargear upgrades",
        "Max. 1 in 3 models may upgrade to fusion blaster"
      ], "upgrades": [{"name": "Fusion blaster", "type": "equipment", "points": 2}, 
          {"name": "Team Leader", "points": 5, "maxcount": 1, "upgrades": [
            {"type": "equipment", "filter": ["+battlesuit wargear", "-special issue"]},
            {"name": "Shas'vre", "points": 5, "maxcount": 1, "upgrades": [
              {"type": "equipment", "name": "markerlight", "points": 10}]}]}
        ]}]
    },
    {"name": "Fire Warriors", "type": "Troops", "mincount": 1, 
      "troops":[{"name": "Shas'la", "points": 10, "mincount": 6, "maxcount": 12, "upgrades": [
        {"name": "Pulse rifle", "type": "equipment", "points": 0},
        {"name": "EMP grenades", "type": "equipment", "points": 3, "all": true},
        {"name": "Photon grenades", "type": "equipment", "points": 1, "all": true},
        {"name": "Shas'ui", "points": 10, "upgrades": [
          {"type": "equipment", "filter": ["+infantry", "-special issue"]},
          {"type": "equipment", "name": "markerlight", "points": 10}
          ]},
        {"name": "Devilfish", "type": "equipment", "points": 80, "maxcount": 1,
          "upgrades": [{"name": "Smart missle system", "type": "equipment", "points": 20},
            {"type": "equipment", "filter": ["+vehicle", "-special issue"]},
          ]
        } //devilfish
        ]}]
    },
    //{"name": "Kroot Carnivore Squad", "type": "Troops", }
    {"name": "Hammerhead Gunship", "type": "Heavy Support",
      "troops": [{"name": "Hammerhead", "mincount": 1, "maxcount": 1,
        "points": 90, "upgrades": [
          {"name": "Ion Cannon", "points": 15},
          {"name": "Railgun", "points": 50},
          {"name": "Two burst cannons", "points": 10},
          {"name": "Pair of Gun Drones", "points": 20},
          {"name": "Smart missle system", "points": 20},
          {"type": "equipment", "filter": ["+vehicle", "-special issue"]}
        ]}]
    }
  ]
});