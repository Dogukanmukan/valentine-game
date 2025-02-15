// Oyun durumu
export const gameState = {
    currentLevel: 1,
    score: 0,
    checkPoint: null,
    cameraX: 0
};

// Bölüm tanımları
export const levels = [
    {
        id: 1,
        name: "Level 1 - Başlangıç",
        levelWidth: 4000,
        enemies: [
            // Yavaş devriye gezen düşmanlar
            { 
                x: 800, y: 650, size: 40, speed: 0.5, velocityX: 0, knockback: false,
                patrolStart: 700, patrolEnd: 900, direction: 1, detectionRange: 300
            },
            { 
                x: 1500, y: 650, size: 40, speed: 0.6, velocityX: 0, knockback: false,
                patrolStart: 1400, patrolEnd: 1600, direction: 1, detectionRange: 300
            },
            { 
                x: 2200, y: 650, size: 40, speed: 0.7, velocityX: 0, knockback: false,
                patrolStart: 2100, patrolEnd: 2300, direction: 1, detectionRange: 300
            }
        ],
        hearts: [
            { x: 1000, y: 650 },
            { x: 2500, y: 650 }
        ],
        gaps: [
            // Kolay zıplanabilir çukurlar
            { x: 600, width: 80 },  
            { x: 1200, width: 85 }, 
            { x: 1800, width: 90 }  
        ],
        platforms: [],
        cats: [
            {
                type: 'cakil',
                x: 3000,
                y: 650,
                patrolStart: 2900,
                patrolEnd: 3100,
                direction: 2,
                detectionRange: 200
            }
        ],
        treasureChest: {
            x: 3700,
            y: 650,
            collected: false
        },
        goal: {
            x: 3800,
            y: 550,
            width: 80,
            height: 150
        }
    },
    {
        id: 2,
        name: "Level 2 - Orta",
        levelWidth: 6000,
        enemies: [
            // Orta hızlı düşmanlar
            { 
                x: 1000, y: 650, size: 45, speed: 0.8, velocityX: 0, knockback: false,
                patrolStart: 900, patrolEnd: 1200, direction: 1, detectionRange: 350
            },
            { 
                x: 2000, y: 500, size: 45, speed: 0.8, velocityX: 0, knockback: false,
                patrolStart: 1900, patrolEnd: 2200, direction: 1, detectionRange: 350
            },
            { 
                x: 3000, y: 650, size: 45, speed: 0.9, velocityX: 0, knockback: false,
                patrolStart: 2900, patrolEnd: 3200, direction: 1, detectionRange: 350
            }
        ],
        hearts: [
            { x: 1500, y: 650 },
            { x: 3500, y: 650 },
            { x: 4500, y: 650 }
        ],
        gaps: [
            // Orta zorlukta zıplanabilir çukurlar
            { x: 800, width: 90 },
            { x: 1600, width: 95 },
            { x: 2400, width: 95 },
            { x: 3200, width: 100 }
        ],
        platforms: [],
        cats: [
            {
                type: 'gumus',
                x: 5000,
                y: 650,
                patrolStart: 4900,
                patrolEnd: 5100,
                direction: 1,
                detectionRange: 200
            }
        ],
        treasureChest: {
            x: 5700,
            y: 650,
            collected: false
        },
        goal: {
            x: 5800,
            y: 550,
            width: 80,
            height: 150
        }
    },
    {
        id: 3,
        name: "Level 3 - Final",
        levelWidth: 8000,
        enemies: [
            // Hızlı devriye grubu
            { 
                x: 1000, y: 650, size: 45, speed: 0.9, velocityX: 0, knockback: false,
                patrolStart: 900, patrolEnd: 1300, direction: 1, detectionRange: 400
            },
            { 
                x: 1200, y: 650, size: 45, speed: 0.9, velocityX: 0, knockback: false,
                patrolStart: 1100, patrolEnd: 1500, direction: 1, detectionRange: 400
            },
            
            // Platform koruyucuları
            { 
                x: 2500, y: 450, size: 50, speed: 0.8, velocityX: 0, knockback: false,
                patrolStart: 2400, patrolEnd: 2700, direction: 1, detectionRange: 400
            },
            { 
                x: 3500, y: 350, size: 50, speed: 0.8, velocityX: 0, knockback: false,
                patrolStart: 3400, patrolEnd: 3700, direction: 1, detectionRange: 400
            },
            
            // Final boss grubu
            { 
                x: 6000, y: 650, size: 55, speed: 1.0, velocityX: 0, knockback: false,
                patrolStart: 5800, patrolEnd: 6200, direction: 1, detectionRange: 450
            },
            { 
                x: 6200, y: 500, size: 50, speed: 0.9, velocityX: 0, knockback: false,
                patrolStart: 6000, patrolEnd: 6400, direction: 1, detectionRange: 450
            }
        ],
        boss: {
            x: 7500,
            y: 600,
            size: 150,
            health: 100,
            direction: -1,
            isInvulnerable: false,
            defeated: false
        },
        savedGuy: {
            x: 7600,
            y: 650,
            size: 96  // Ana karakter boyutuyla uyumlu
        },
        hearts: [
            { x: 2000, y: 650 },
            { x: 4000, y: 650 },
            { x: 6000, y: 650 }
        ],
        gaps: [
            // Zor ama zıplanabilir çukurlar
            { x: 800, width: 100 },
            { x: 1400, width: 105 },
            { x: 2200, width: 105 },
            { x: 3000, width: 110 },
            { x: 4500, width: 110 },
            { x: 5500, width: 115 }  
        ],
        platforms: [],
        cats: [
            {
                type: 'kedi',
                x: 7000,
                y: 650,
                patrolStart: 6900,
                patrolEnd: 7100,
                direction: 1,
                detectionRange: 200
            }
        ],
        treasureChest: {
            x: 7700,
            y: 650,
            collected: false
        },
        goal: {
            x: 7800,
            y: 550,
            width: 80,
            height: 150
        }
    }
];
