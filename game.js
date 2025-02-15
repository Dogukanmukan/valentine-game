// Canvas ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutlarını ayarla
canvas.width = 800;
canvas.height = 800;  // Yüksekliği artırdım

// Levels ve gameState'i import et
import { levels, gameState } from '/levels.js';

// Oyun ölçeği
const SCALE = 2;
const SPRITE_SIZE = 120;
const SPRITE_HEIGHT = 160;

// Fizik değerleri
const gravity = 0.6;  // Yerçekimini artırdım
const friction = 0.8;

// Kontroller
const keys = {
    right: false,
    left: false,
    up: false,
    attack: false
};

// Oyun durumları
const GAME_STATES = {
    STORY: 'story',
    PLAYING: 'playing',
    LEVEL_END: 'level_end',
    GAME_OVER: 'gameover',
    WIN: 'win'
};

let currentGameState = GAME_STATES.STORY;

// Hikaye ekranı metni
const storyText = [
    "Hande, mutlu bir şekilde kedileri Çakıl ve Gümüş ile",
    "birlikte yaşarken, bir gün Kötülük adlı kötü karakter,",
    "Çakıl'ı alıp karanlık bir ormanın derinliklerine götürür.",
    "Hande, sevdiği kedisini kurtarmak için cesurca ormanın",
    "yolunu tutar. Kalbinde, ona her zaman destek olan",
    "sevgilisi Doğukan'ı düşünerek güç bulur.",
    "",
    "Başlamak için ENTER tuşuna basın"
].join('\n');

// Bölüm sonu metinleri
const levelEndTexts = {
    1: "İlk kedini kurtardın, sevgilim... ❤️\nÇakıl artık seninle. Ama bu, sadece başlangıç.\nKötülük'ün tuzaklarına rağmen, kalbim her zaman seninle.\nGümüşü kurtarmak için birlikte daha fazla mücadele edeceğiz.",
    2: "Gümüş de senin yanında, sevgilim. 💕\nKötülük senin sevgini asla bozamayacak.\nBirlikte her şey daha parlak, her şey daha güzel.\nHedefimiz yakın; huzur getirmek için sadece bir engel kaldı.",
    3: "Ve Doğukan'ı kurtardım... 💝\nKötülük gitti, kasaba güvenli!\nAma asıl zafer, seninle her anı paylaşabilmek.\nTüm bu yolculuk seninle daha anlamlı.\nİyi ki varsın, sevgilim.\nBirlikte her engeli aşarız, sevgi her zaman kazanır."
};

// Hikaye ekranını çiz
function drawStoryScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Kalp deseni çiz
    const time = Date.now() * 0.001; // Animasyon için zaman
    ctx.fillStyle = 'rgba(255, 192, 203, 0.1)';
    for (let i = 0; i < 10; i++) {
        const x = canvas.width / 2 + Math.cos(time + i) * 100;
        const y = canvas.height / 2 + Math.sin(time + i * 0.5) * 100;
        drawHeart(x, y, 20);
    }

    // Başlık
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    const gradient = ctx.createLinearGradient(
        canvas.width / 2 - 100,
        canvas.height / 3,
        canvas.width / 2 + 100,
        canvas.height / 3
    );
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.5, '#ff1493');
    gradient.addColorStop(1, '#ff69b4');
    ctx.fillStyle = gradient;
    ctx.fillText('Sevgililer Günü Macerası', canvas.width / 2, canvas.height / 3);

    // Hikaye metni
    const lines = storyText.split('\n');
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    lines.forEach((line, index) => {
        const y = canvas.height / 2 + index * 40;
        // Son satır için yanıp sönen efekt
        if (index === lines.length - 1) {
            const alpha = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fillText(line, canvas.width / 2, y);
    });
}

// Kalp çizim fonksiyonu
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(
        x, y, 
        x - size / 2, y, 
        x - size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
        x - size / 2, y + size / 2, 
        x, y + size * 3/4, 
        x, y + size
    );
    ctx.bezierCurveTo(
        x, y + size * 3/4, 
        x + size / 2, y + size / 2, 
        x + size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
        x + size / 2, y, 
        x, y, 
        x, y + size / 4
    );
    ctx.fill();
}

// Bölüm sonu ekranını çiz
function drawLevelEndScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dekoratif çerçeve
    const margin = 50;
    const borderWidth = 5;
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

    // Başlık
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    const gradient = ctx.createLinearGradient(
        canvas.width / 2 - 100,
        canvas.height / 3,
        canvas.width / 2 + 100,
        canvas.height / 3
    );
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.5, '#ff1493');
    gradient.addColorStop(1, '#ff69b4');
    ctx.fillStyle = gradient;
    ctx.fillText(`${gameState.currentLevel}. Bölüm Tamamlandı!`, canvas.width / 2, canvas.height / 3);

    // Bölüm sonu metni
    ctx.font = '28px Arial';
    ctx.fillStyle = '#fff';
    const text = levelEndTexts[gameState.currentLevel];
    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + index * 40);
    });

    // Devam metni
    ctx.font = '24px Arial';
    const alpha = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText('Devam etmek için ENTER tuşuna basın', canvas.width / 2, canvas.height * 3/4);

    // Dekoratif kalpler
    const time = Date.now() * 0.001;
    ctx.fillStyle = 'rgba(255, 192, 203, 0.2)';
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const x = canvas.width / 2 + Math.cos(angle) * 200;
        const y = canvas.height / 2 + Math.sin(angle) * 200;
        drawHeart(x, y, 30);
    }
}

// Tuş olayları
document.addEventListener('keydown', (e) => {
    if (currentGameState === GAME_STATES.STORY && e.key === 'Enter') {
        currentGameState = GAME_STATES.PLAYING;
    } else if (currentGameState === GAME_STATES.LEVEL_END && e.key === 'Enter') {
        currentGameState = GAME_STATES.PLAYING;
        completeLevel();
    }
    switch(e.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
            keys.right = true;
            break;
        case 'arrowleft':
        case 'a':
            keys.left = true;
            break;
        case 'arrowup':
        case 'w':
        case ' ':
            keys.up = true;
            break;
        case 'e':
            // Saldırı tuşuna basıldı
            if (!heroine.isAttacking && Date.now() - heroine.lastAttackTime > heroine.attackDuration) {
                heroine.isAttacking = true;
                heroine.lastAttackTime = Date.now();
                // Saldırı süresinden sonra saldırı durumunu kapat
                setTimeout(() => {
                    heroine.isAttacking = false;
                }, heroine.attackDuration);
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
            keys.right = false;
            break;
        case 'arrowleft':
        case 'a':
            keys.left = false;
            break;
        case 'arrowup':
        case 'w':
        case ' ':
            keys.up = false;
            break;
    }
});

// Sprite yükleme
const heroineSprites = {
    idle: {
        frames: [],
        currentFrame: 0
    },
    run: {
        frames: [],
        currentFrame: 0
    },
    jump: {
        frames: [],
        currentFrame: 0
    },
    attack: {
        frames: [],
        currentFrame: 0
    },
    currentState: 'idle',
    frameDelay: 12,
    frameTimer: 0
};

// Kalp sprite'ları
const heartSprites = {
    sheet: new Image(),
    frameWidth: 16,
    frameHeight: 16,
    currentFrame: 0,
    frameCount: 6,
    frameDelay: 8,
    frameTimer: 0
};

// UI sprite'ları
const uiSprites = {
    healthIndicator: new Image()
};

// Platform görüntüleri
const tileSprites = {
    sheet: new Image(),
    tileSize: 32,
    ground: {
        left: { x: 0, y: 0 },
        middle: { x: 32, y: 0 },
        right: { x: 64, y: 0 }
    },
    platform: {
        left: { x: 2, y: 2 },
        middle: { x: 2, y: 2 },
        right: { x: 2, y: 2 }
    }
};

// Hazine sandığı sprite'ı
const treasureChest = {
    img: new Image(),
    width: 32,
    height: 16,  // Yüksekliği 16 olarak düzelttim
    frameX: 0,
    frameY: 0,
    maxFrame: 3,
    animationSpeed: 10,
    frameCount: 0,
    collected: false
};

// Kedi sprite'ları
const cats = {
    cakil: {
        img: new Image(),
        width: 32,
        height: 32,
        frameX: 0,
        frameY: 0,
        maxFrame: 4,
        animationSpeed: 10,
        frameCount: 0,
        direction: 1,
        speed: 2,
        following: false,
        idle: new Image(),
        jump: new Image()
    },
    gumus: {
        img: new Image(),
        width: 32,
        height: 32,
        frameX: 0,
        frameY: 0,
        maxFrame: 4,
        animationSpeed: 10,
        frameCount: 0,
        direction: 1,
        speed: 2,
        following: false,
        idle: new Image(),
        jump: new Image()
    }
};

// Düşman sprite'ları
const enemySprites = {
    idle: new Image(),
    walk: new Image(),
    attack1: new Image(),
    attack2: new Image(),
    hurt: new Image(),
    death: new Image(),
    width: 34,
    height: 60,
    frameX: 0,
    frameY: 0,
    maxFrames: {
        idle: 6,
        walk: 8,
        attack1: 6,
        attack2: 6,
        hurt: 4,
        death: 6
    },
    animationSpeed: 8,  // Animasyon hızını düşürdük
    frameCount: 0,
    scale: 4  // Ölçek faktörü eklendi
};

// Boss sprite'ı
const bossSprites = {
    img: new Image(),
    width: 100,
    height: 100,
    scale: 3,
    state: 'idle',
    health: 100,
    flashTimer: 0,  // Hasar alınca yanıp sönme efekti için
    shakeTimer: 0,  // Saldırı efekti için
    shakeAmount: 0  // Saldırı titreşim miktarı
};

// Kurtarılan kişi sprite'ı
const savedGuySprites = {
    img: new Image(),
    width: 32,
    height: 48,  // Ana karakter gibi 48 piksel yükseklik
    frameX: 0,
    frameY: 0,
    maxFrames: 6,
    animationSpeed: 15,  // Ana karakterle aynı animasyon hızı
    frameCount: 0,
    scale: 3,  // Ana karakterle aynı ölçek
    isVisible: false
};

// Sprite'ları yükle
function loadSprites() {
    // Idle sprite'ları
    for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = `assets/idle/idle${i}.png`;
        heroineSprites.idle.frames.push(img);
    }

    // Run sprite'ları
    for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.src = `assets/run/run${i}.png`;
        heroineSprites.run.frames.push(img);
    }

    // Jump sprite'ları
    for (let i = 1; i <= 2; i++) {
        const img = new Image();
        img.src = `assets/jump/jump${i}.png`;
        heroineSprites.jump.frames.push(img);
    }

    // Attack sprite'ları
    for (let i = 1; i <= 5; i++) {
        const img = new Image();
        img.src = `assets/attack/attack${i}.png`;
        heroineSprites.attack.frames.push(img);
    }

    // Kalp sprite sheet'ini yükle
    heartSprites.sheet.src = 'assets/Mini FX, Items & UI/Common Pick-ups/Heart_Spin (16 x 16).png';

    // UI sprite'larını yükle
    uiSprites.healthIndicator.src = 'assets/Mini FX, Items & UI/Mini UI/Health_Indicator_White_Outline (8 x 8).png';

    // Tile sprite sheet'i yükle
    tileSprites.sheet.src = 'assets/tiles/Tiles.png';

    // Hazine sandığı sprite'ını yükle
    treasureChest.img.src = './assets/Mini FX, Items & UI/Common Pick-ups/Treasure_Chest (32 x 16).png';

    // Kedi sprite'larını yükle
    cats.cakil.idle.src = './assets/cakil/IdleCattt.png';
    cats.cakil.jump.src = './assets/cakil/JumpCatttt.png';
    cats.gumus.idle.src = './assets/gumus/IdleCatt.png';
    cats.gumus.jump.src = './assets/gumus/JumpCattt.png';
    
    // Ana hareket sprite'ı olarak idle'ı kullan
    cats.cakil.img = cats.cakil.idle;
    cats.gumus.img = cats.gumus.idle;

    // Düşman sprite'larını yükle
    enemySprites.idle.src = './assets/orc/Orc-Idle.png';
    enemySprites.walk.src = './assets/orc/Orc-Walk.png';
    enemySprites.attack1.src = './assets/orc/Orc-Attack01.png';
    enemySprites.attack2.src = './assets/orc/Orc-Attack02.png';
    enemySprites.hurt.src = './assets/orc/Orc-Hurt.png';
    enemySprites.death.src = './assets/orc/Orc-Death.png';

    // Boss sprite'ını yükle
    bossSprites.img.src = './assets/behemoth.png';

    // Kurtarılan kişi sprite'ını yükle
    savedGuySprites.img.src = './assets/Guy Sprite Sheet.png';
}

// Platform çizimi
function drawPlatform(platform) {
    const tileSize = tileSprites.tileSize;
    
    // Sol kenar
    ctx.drawImage(
        tileSprites.sheet,
        tileSprites.platform.left.x,
        tileSprites.platform.left.y,
        tileSize,
        tileSize,
        platform.x - gameState.cameraX,
        platform.y,
        tileSize,
        platform.height
    );
    
    // Orta kısım
    const middleCount = Math.floor((platform.width - (tileSize * 2)) / tileSize);
    for(let i = 0; i < middleCount; i++) {
        ctx.drawImage(
            tileSprites.sheet,
            tileSprites.platform.middle.x,
            tileSprites.platform.middle.y,
            tileSize,
            tileSize,
            platform.x + tileSize + (i * tileSize) - gameState.cameraX,
            platform.y,
            tileSize,
            platform.height
        );
    }
    
    // Sağ kenar
    ctx.drawImage(
        tileSprites.sheet,
        tileSprites.platform.right.x,
        tileSprites.platform.right.y,
        tileSize,
        tileSize,
        platform.x + platform.width - tileSize - gameState.cameraX,
        platform.y,
        tileSize,
        platform.height
    );
}

// Hazine sandığını çiz
function drawTreasureChest(level) {
    if (!level.treasureChest || level.treasureChest.collected) return;
    
    // Animasyon
    treasureChest.frameCount++;
    if (treasureChest.frameCount >= treasureChest.animationSpeed) {
        treasureChest.frameCount = 0;
        treasureChest.frameX = (treasureChest.frameX + 1) % treasureChest.maxFrame;
    }
    
    // Sandığı çiz
    ctx.drawImage(
        treasureChest.img,
        treasureChest.frameX * treasureChest.width,
        treasureChest.frameY * treasureChest.height,
        treasureChest.width,
        treasureChest.height,
        level.treasureChest.x - gameState.cameraX,
        level.treasureChest.y,
        treasureChest.width * SCALE,
        treasureChest.height * SCALE
    );
}

// Hazine sandığı kontrolü
function checkTreasureChest(level) {
    if (!level.treasureChest || level.treasureChest.collected) return;

    const heroineBox = {
        x: heroine.x,
        y: heroine.y,
        width: heroine.width,
        height: heroine.height
    };

    const chestBox = {
        x: level.treasureChest.x,
        y: level.treasureChest.y,
        width: treasureChest.width * SCALE,
        height: treasureChest.height * SCALE
    };

    if (checkCollision(heroineBox, chestBox)) {
        level.treasureChest.collected = true;
        currentGameState = GAME_STATES.LEVEL_END;
    }
}

// Kediyi çiz ve animasyonunu yap
function drawCat(cat, catData) {
    if (!cat || !catData) return;
    
    // Animasyon
    catData.frameCount++;
    if (catData.frameCount >= catData.animationSpeed) {
        catData.frameCount = 0;
        catData.frameX = (catData.frameX + 1) % catData.maxFrame;
    }
    
    // Kediyi çiz
    ctx.save();
    if (catData.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            catData.img,
            catData.frameX * catData.width,
            catData.frameY * catData.height,
            catData.width,
            catData.height,
            -(cat.x - gameState.cameraX + catData.width * SCALE),
            cat.y,
            catData.width * SCALE,
            catData.height * SCALE
        );
    } else {
        ctx.drawImage(
            catData.img,
            catData.frameX * catData.width,
            catData.frameY * catData.height,
            catData.width,
            catData.height,
            cat.x - gameState.cameraX,
            cat.y,
            catData.width * SCALE,
            catData.height * SCALE
        );
    }
    ctx.restore();
}

// Kedi takip fonksiyonu
function updateCat(cat, catData) {
    if (!cat || !catData) return;

    const distance = heroine.x - cat.x;
    
    // Eğer takip etmiyorsa devriye gezsin
    if (!catData.following) {
        // Devriye hareketi
        if (cat.direction === 1) {
            cat.x += catData.speed;
            if (cat.x >= cat.patrolEnd) {
                cat.direction = -1;
                catData.direction = -1;
            }
        } else {
            cat.x -= catData.speed;
            if (cat.x <= cat.patrolStart) {
                cat.direction = 1;
                catData.direction = 1;
            }
        }

        // Kahramana yakınsa ve menzil içindeyse takip etmeye başla
        if (Math.abs(distance) < cat.detectionRange) {
            catData.following = true;
        }
    } else {
        // Takip hareketi
        if (distance > 0) {
            cat.x += catData.speed;
            catData.direction = 1;
        } else {
            cat.x -= catData.speed;
            catData.direction = -1;
        }

        // Kahramana çok yaklaşmasını engelle
        const minDistance = 30;
        if (Math.abs(distance) < minDistance) {
            cat.x = heroine.x - (minDistance * catData.direction);
        }
    }
}

// Boss'u çiz ve güncelle
function drawBoss(level) {
    if (!level.boss || level.boss.defeated) return;
    
    const boss = level.boss;
    const drawWidth = bossSprites.width * bossSprites.scale;
    const drawHeight = bossSprites.height * bossSprites.scale;
    
    // Boss'u çiz
    ctx.save();

    // Hasar alınca kırmızı yanıp sönme efekti
    if (bossSprites.flashTimer > 0) {
        ctx.globalAlpha = 0.7 + Math.sin(bossSprites.flashTimer * 0.5) * 0.3;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(
            boss.x - gameState.cameraX,
            boss.y - (drawHeight - boss.size),
            drawWidth,
            drawHeight
        );
        bossSprites.flashTimer--;
    }

    // Saldırı sırasında titreşim efekti
    let offsetX = 0;
    let offsetY = 0;
    if (bossSprites.shakeTimer > 0) {
        offsetX = (Math.random() - 0.5) * bossSprites.shakeAmount;
        offsetY = (Math.random() - 0.5) * bossSprites.shakeAmount;
        bossSprites.shakeTimer--;
    }
    
    if (boss.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            bossSprites.img,
            0,
            0,
            bossSprites.width,
            bossSprites.height,
            -(boss.x - gameState.cameraX + drawWidth) + offsetX,
            boss.y - (drawHeight - boss.size) + offsetY,
            drawWidth,
            drawHeight
        );
    } else {
        ctx.drawImage(
            bossSprites.img,
            0,
            0,
            bossSprites.width,
            bossSprites.height,
            boss.x - gameState.cameraX + offsetX,
            boss.y - (drawHeight - boss.size) + offsetY,
            drawWidth,
            drawHeight
        );
    }
    
    // Can barını çiz
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = boss.x - gameState.cameraX + (drawWidth / 2) - (healthBarWidth / 2);
    const healthBarY = boss.y - 40;
    
    // Arka plan
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Mevcut can
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(healthBarX, healthBarY, (boss.health / 100) * healthBarWidth, healthBarHeight);
    
    ctx.restore();
}

// Boss davranışı
function updateBoss(level) {
    if (!level.boss || level.boss.defeated) return;
    
    const boss = level.boss;
    const distanceToPlayer = heroine.x - boss.x;
    
    // Boss'un durumunu güncelle
    if (Math.abs(distanceToPlayer) < 150) {
        bossSprites.state = 'attack';
        // Saldırı sırasında titreşim efekti
        if (bossSprites.shakeTimer <= 0) {
            bossSprites.shakeTimer = 20;
            bossSprites.shakeAmount = 5;
        }
        
        // Saldırı sırasında oyuncuya hasar ver
        if (Math.abs(distanceToPlayer) < 100 && !heroine.isInvulnerable) {
            heroine.lives--;
            heroine.isInvulnerable = true;
            setTimeout(() => {
                heroine.isInvulnerable = false;
            }, 1000);
        }
    } else {
        bossSprites.state = 'idle';
        // Oyuncuyu takip et
        if (distanceToPlayer > 0) {
            boss.x += 2;
            boss.direction = 1;
        } else {
            boss.x -= 2;
            boss.direction = -1;
        }
    }
    
    // Boss'a hasar verme kontrolü
    if (heroine.isAttacking && 
        Math.abs(distanceToPlayer) < 100 && 
        !boss.isInvulnerable) {
        boss.health -= 10;
        boss.isInvulnerable = true;
        bossSprites.state = 'hurt';
        
        // Hasar alınca yanıp sönme efekti
        bossSprites.flashTimer = 30;
        
        setTimeout(() => {
            boss.isInvulnerable = false;
            bossSprites.state = 'idle';
        }, 500);
        
        // Boss yenildi mi kontrol et
        if (boss.health <= 0) {
            boss.defeated = true;
            showSavedGuy();  // Kurtarılan kişiyi göster
            // Oyunu kazan
            winGame();
        }
    }
}

// Kurtarılan kişiyi çiz
function drawSavedGuy(level) {
    if (!savedGuySprites.isVisible || !level.savedGuy) return;
    
    const guy = level.savedGuy;
    
    // Animasyon
    savedGuySprites.frameCount++;
    if (savedGuySprites.frameCount >= savedGuySprites.animationSpeed) {
        savedGuySprites.frameCount = 0;
        savedGuySprites.frameX = (savedGuySprites.frameX + 1) % savedGuySprites.maxFrames;
    }
    
    const drawWidth = savedGuySprites.width * savedGuySprites.scale;
    const drawHeight = savedGuySprites.height * savedGuySprites.scale;
    
    // Kurtarılan kişiyi çiz
    ctx.save();
    ctx.drawImage(
        savedGuySprites.img,
        savedGuySprites.frameX * savedGuySprites.width,
        savedGuySprites.frameY * savedGuySprites.height,
        savedGuySprites.width,
        savedGuySprites.height,
        guy.x - gameState.cameraX,
        guy.y - drawHeight + (guy.size / 2),  // Pozisyonu düzelt
        drawWidth,
        drawHeight
    );
    
    // Konuşma balonu
    if (Math.abs(heroine.x - guy.x) < 100) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        const message = "Beni kurtardığın için teşekkür ederim!";
        const bubblePadding = 10;
        const textWidth = ctx.measureText(message).width;
        const bubbleWidth = textWidth + bubblePadding * 2;
        const bubbleHeight = 30;
        const bubbleX = guy.x - gameState.cameraX - bubbleWidth / 2 + drawWidth / 2;
        const bubbleY = guy.y - drawHeight - bubbleHeight - 20;  // Balonu biraz yukarı al
        
        // Balon arka planı
        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight);
        ctx.lineTo(bubbleX + bubbleWidth/2 + 10, bubbleY + bubbleHeight);
        ctx.lineTo(bubbleX + bubbleWidth/2, bubbleY + bubbleHeight + 10);
        ctx.lineTo(bubbleX + bubbleWidth/2 - 10, bubbleY + bubbleHeight);
        ctx.lineTo(bubbleX, bubbleY + bubbleHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Mesaj
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(message, bubbleX + bubbleWidth/2, bubbleY + bubbleHeight/2 + 5);
    }
    
    ctx.restore();
}

// Boss yenilince kurtarılan kişiyi göster
function showSavedGuy() {
    savedGuySprites.isVisible = true;
}

// Arka plan görüntüleri
const backgroundImages = {
    level1: new Image(),
    level2: new Image(),
    level3: new Image()
};

// Arka plan görüntülerini yükle
backgroundImages.level1.src = './assets/Animated Pixel-Art Backgrounds Free/Art/Background 5 (Bonus).png';
backgroundImages.level2.src = './assets/Animated Pixel-Art Backgrounds Free/Art/Background 6 (Bonus).png';
backgroundImages.level3.src = './assets/Animated Pixel-Art Backgrounds Free/Art/Background 7 (Bonus).png';

// Oyun karakterleri
const heroine = {
    x: 50,
    y: 500,  // Başlangıç yüksekliğini ayarladım
    width: SPRITE_SIZE,
    height: SPRITE_HEIGHT,
    speed: 5,
    velocityY: 0,
    jumpForce: -12,  // Zıplama kuvveti
    isJumping: false,
    direction: 1,
    lives: 5,
    isAttacking: false,
    attackDuration: 500, // ms cinsinden saldırı süresi
    lastAttackTime: 0,
    isInvulnerable: false
};

// Çarpışma kontrolü
function checkCollision(obj1, obj2) {
    // Yatayda çarpışma kontrolü
    const horizontalCollision = 
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x;

    // Dikeyde çarpışma kontrolü
    const verticalCollision = 
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;

    // Platform kontrolü
    if (obj2.height <= 20) { // Platform ise
        const characterCenter = obj1.x + (obj1.width / 2);
        const platformStart = obj2.x;
        const platformEnd = obj2.x + obj2.width;
        
        // Karakterin sağ ayağı platformun üstünde mi?
        const rightFootOnPlatform = obj1.x + obj1.width > platformStart + 5;
        // Karakterin sol ayağı platformun üstünde mi?
        const leftFootOnPlatform = obj1.x < platformEnd - 5;
        
        // Karakter düşüyor ve platform üzerinde mi?
        const fallingOnPlatform = 
            obj1.velocityY > 0 && // Düşüyor
            obj1.y + obj1.height <= obj2.y + 10 && // Platform üstüne yakın
            obj1.y + obj1.height >= obj2.y - 10; // Çok uzak değil

        // Karakter platformun üzerinde ve en az bir ayağı platformda
        return fallingOnPlatform && 
               characterCenter > platformStart && 
               characterCenter < platformEnd && 
               (rightFootOnPlatform || leftFootOnPlatform);
    }

    return horizontalCollision && verticalCollision;
}

// Çukur kontrolü ve zemin çizimi fonksiyonlarını düzeltiyorum
function checkMainGroundCollision(level) {
    let onGround = false;
    
    // Çukurları kontrol et
    if (level.gaps) {
        for (let gap of level.gaps) {
            // Karakter çukurun üstünde mi?
            // Karakterin merkezi çukurun içinde mi kontrol et
            const characterCenterX = heroine.x + (heroine.width / 2);
            const characterCenterY = heroine.y + (heroine.height / 2);
            const gapStart = gap.x;
            const gapEnd = gap.x + gap.width;
            
            // Karakterin sağ ayağı zeminden çıktı mı?
            const rightFootPastEdge = heroine.x + heroine.width > gapStart + 5;
            // Karakterin sol ayağı zeminden çıktı mı?
            const leftFootPastEdge = heroine.x < gapEnd - 5;
            
            // Eğer karakter çukurun üstündeyse ve ayakları zeminden çıktıysa düşmeli
            if (characterCenterX > gapStart && characterCenterX < gapEnd && 
                (rightFootPastEdge || leftFootPastEdge)) {
                return false; // Çukurun üstündeyse zemine değmiyor
            }
        }
    }

    // Ana zemin kontrolü
    if (heroine.y + heroine.height >= 700) {
        onGround = true;
        heroine.y = 700 - heroine.height;
        heroine.velocityY = 0;
        heroine.isJumping = false;
    }

    return onGround;
}

// Ana zemini çiz
function drawMainGround(level) {
    const groundY = 700;
    
    // Çukurları kontrol et
    if (level.gaps) {
        let currentX = 0;
        
        level.gaps.forEach(gap => {
            // Çukurdan önceki zemin parçası
            if (currentX < gap.x) {
                // Sol kenar
                ctx.drawImage(
                    tileSprites.sheet,
                    tileSprites.ground.left.x,
                    tileSprites.ground.left.y,
                    tileSprites.tileSize,
                    tileSprites.tileSize,
                    currentX - gameState.cameraX,
                    groundY,
                    tileSprites.tileSize,
                    20
                );
                
                // Orta kısım
                const middleCount = Math.floor((gap.x - currentX - (tileSprites.tileSize * 2)) / tileSprites.tileSize);
                for(let i = 0; i < middleCount; i++) {
                    ctx.drawImage(
                        tileSprites.sheet,
                        tileSprites.ground.middle.x,
                        tileSprites.ground.middle.y,
                        tileSprites.tileSize,
                        tileSprites.tileSize,
                        currentX + tileSprites.tileSize + (i * tileSprites.tileSize) - gameState.cameraX,
                        groundY,
                        tileSprites.tileSize,
                        20
                    );
                }
                
                // Sağ kenar
                ctx.drawImage(
                    tileSprites.sheet,
                    tileSprites.ground.right.x,
                    tileSprites.ground.right.y,
                    tileSprites.tileSize,
                    tileSprites.tileSize,
                    gap.x - tileSprites.tileSize - gameState.cameraX,
                    groundY,
                    tileSprites.tileSize,
                    20
                );
            }
            currentX = gap.x + gap.width;
        });
        
        // Son parça
        if (currentX < level.levelWidth) {
            // Sol kenar
            ctx.drawImage(
                tileSprites.sheet,
                tileSprites.ground.left.x,
                tileSprites.ground.left.y,
                tileSprites.tileSize,
                tileSprites.tileSize,
                currentX - gameState.cameraX,
                groundY,
                tileSprites.tileSize,
                20
            );
            
            // Orta kısım
            const middleCount = Math.floor((level.levelWidth - currentX - (tileSprites.tileSize * 2)) / tileSprites.tileSize);
            for(let i = 0; i < middleCount; i++) {
                ctx.drawImage(
                    tileSprites.sheet,
                    tileSprites.ground.middle.x,
                    tileSprites.ground.middle.y,
                    tileSprites.tileSize,
                    tileSprites.tileSize,
                    currentX + tileSprites.tileSize + (i * tileSprites.tileSize) - gameState.cameraX,
                    groundY,
                    tileSprites.tileSize,
                    20
                );
            }
            
            // Sağ kenar
            ctx.drawImage(
                tileSprites.sheet,
                tileSprites.ground.right.x,
                tileSprites.ground.right.y,
                tileSprites.tileSize,
                tileSprites.tileSize,
                level.levelWidth - tileSprites.tileSize - gameState.cameraX,
                groundY,
                tileSprites.tileSize,
                20
            );
        }
    }
}

// Düşman çarpışma kontrolü
function checkEnemyCollision(level) {
    if (level.enemies) {
        for (let enemy of level.enemies) {
            // Eğer düşman geri tepme durumundaysa kontrol etme
            if (enemy.knockback) continue;

            // Düşmanla karakter arasındaki mesafe
            const dx = (heroine.x + heroine.width/2) - (enemy.x + enemy.size/2);
            const dy = (heroine.y + heroine.height/2) - (enemy.y + enemy.size/2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Çarpışma kontrolü (yarıçapların toplamı) - daha hassas çarpışma için 0.7 çarpanı
            if (distance < (heroine.width/2 + enemy.size/2) * 0.7) {
                // Düşmanı geri tepme durumuna al
                enemy.knockback = true;
                enemy.velocityX = -dx/distance * 10;
                
                setTimeout(() => {
                    enemy.knockback = false;
                    enemy.velocityX = 0;
                }, 1000);

                // Can kaybı
                heroine.lives--;
                if (heroine.lives <= 0) {
                    // Oyun bitti
                    alert('Öp!');
                    resetGame();
                }
                return true;
            }
        }
    }
    return false;
}

// Saldırı çarpışma kontrolü
function checkAttackCollision(level) {
    if (level.enemies && heroine.isAttacking) {
        // Saldırı menzili (karakterin önünde)
        const attackRange = 80;
        const attackX = heroine.direction === 1 ? 
            heroine.x + heroine.width/2 : // Karakterin ortasından başlat
            heroine.x - attackRange + heroine.width/2;

        // Düşmanları filtrele (yaşayanları tut)
        level.enemies = level.enemies.filter(enemy => {
            // Düşmanla saldırı alanı arasındaki mesafe
            const dx = (enemy.x + enemy.size/2) - attackX;
            const dy = (enemy.y + enemy.size/2) - (heroine.y + heroine.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Saldırı alanı kontrolü
            const hitboxSize = attackRange * 1.2; // Saldırı alanını %20 genişlet
            
            // Eğer düşman saldırı alanı içindeyse ve karakterin baktığı yöndeyse yok et
            const isInRange = distance < hitboxSize;
            const isInDirection = (heroine.direction === 1 && dx > 0) || (heroine.direction === -1 && dx < 0);
            
            // Saldırı menzilinde ve doğru yöndeyse düşmanı yok et (false döndür)
            return !(isInRange && isInDirection);
        });
    }
}

// Düşmanları güncelle
function updateEnemies(level) {
    if (level.enemies) {
        for (let enemy of level.enemies) {
            if (enemy.knockback) {
                // Geri tepme durumunda, velocityX ile hareket et
                enemy.x += enemy.velocityX;
                // Yavaşça dur
                enemy.velocityX *= 0.95;
            } else {
                // Karakterle düşman arasındaki mesafe
                const dx = (heroine.x + heroine.width/2) - (enemy.x + enemy.size/2);
                const dy = (heroine.y + heroine.height/2) - (enemy.y + enemy.size/2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Karakter menzilde mi kontrol et
                if (distance <= enemy.detectionRange) {
                    // Karakteri takip et
                    if (distance > 0) {
                        enemy.x += (dx / distance) * enemy.speed;
                    }
                } else {
                    // Devriye gezme
                    if (enemy.direction === 1) {
                        enemy.x += enemy.speed;
                        if (enemy.x >= enemy.patrolEnd) {
                            enemy.direction = -1;
                        }
                    } else {
                        enemy.x -= enemy.speed;
                        if (enemy.x <= enemy.patrolStart) {
                            enemy.direction = 1;
                        }
                    }
                }
            }
        }
    }
}

// Düşmanları çiz
function drawEnemies(level) {
    if (!level.enemies) return;
    
    level.enemies.forEach(enemy => {
        if (!enemy.frameX) enemy.frameX = 0;  // Her düşman için ayrı frame takibi
        if (!enemy.frameCount) enemy.frameCount = 0;
        
        // Düşmanın durumuna göre sprite seç
        let currentSprite;
        let maxFrame;
        
        if (enemy.knockback) {
            currentSprite = enemySprites.hurt;
            maxFrame = enemySprites.maxFrames.hurt;
        } else if (Math.abs(heroine.x - enemy.x) < 50 && !enemy.knockback) {
            currentSprite = enemySprites.attack1;
            maxFrame = enemySprites.maxFrames.attack1;
        } else if (enemy.velocityX !== 0) {
            currentSprite = enemySprites.walk;
            maxFrame = enemySprites.maxFrames.walk;
        } else {
            currentSprite = enemySprites.idle;
            maxFrame = enemySprites.maxFrames.idle;
        }
        
        // Her düşman için ayrı animasyon
        enemy.frameCount++;
        if (enemy.frameCount >= enemySprites.animationSpeed) {
            enemy.frameCount = 0;
            enemy.frameX = (enemy.frameX + 1) % maxFrame;
        }
        
        const drawWidth = enemySprites.width * enemySprites.scale;
        const drawHeight = enemySprites.height * enemySprites.scale;
        
        // Düşmanı çiz
        ctx.save();
        if (enemy.direction === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentSprite,
                enemy.frameX * enemySprites.width,  // Her düşmanın kendi frame'ini kullan
                enemySprites.frameY * enemySprites.height,
                enemySprites.width,
                enemySprites.height,
                -(enemy.x - gameState.cameraX + drawWidth),
                enemy.y - (drawHeight - enemy.size),
                drawWidth,
                drawHeight
            );
        } else {
            ctx.drawImage(
                currentSprite,
                enemy.frameX * enemySprites.width,  // Her düşmanın kendi frame'ini kullan
                enemySprites.frameY * enemySprites.height,
                enemySprites.width,
                enemySprites.height,
                enemy.x - gameState.cameraX,
                enemy.y - (drawHeight - enemy.size),
                drawWidth,
                drawHeight
            );
        }
        ctx.restore();
    });
}

// Kalpleri çiz ve topla
function drawAndCollectHearts() {
    const currentLevel = levels[gameState.currentLevel - 1]; // currentLevel -1 olmalı çünkü level 1'den başlıyor
    
    // Kalp animasyonu
    heartSprites.frameTimer++;
    if (heartSprites.frameTimer >= heartSprites.frameDelay) {
        heartSprites.currentFrame = (heartSprites.currentFrame + 1) % heartSprites.frameCount;
        heartSprites.frameTimer = 0;
    }

    // Eğer level'da kalpler tanımlı değilse, boş bir dizi oluştur
    if (!currentLevel.hearts) {
        currentLevel.hearts = [];
    }

    currentLevel.hearts.forEach((heart, index) => {
        if (!heart.collected) {
            // Kalp toplama kontrolü
            const characterLeft = heroine.x;
            const characterRight = heroine.x + heroine.width;
            const characterTop = heroine.y;
            const characterBottom = heroine.y + heroine.height;
            
            const heartLeft = heart.x;
            const heartRight = heart.x + 30;
            const heartTop = heart.y;
            const heartBottom = heart.y + 30;
            
            // Karakter ve kalp çarpışıyor mu?
            if (characterRight > heartLeft && 
                characterLeft < heartRight && 
                characterBottom > heartTop && 
                characterTop < heartBottom) {
                heart.collected = true;
                heroine.lives = Math.min(heroine.lives + 1, 5);
                return; // Kalp toplandıysa çizmeye gerek yok
            }

            // Kalbi çiz
            if (heartSprites.sheet.complete) {
                const frameX = heartSprites.currentFrame * heartSprites.frameWidth;
                ctx.drawImage(
                    heartSprites.sheet,
                    frameX, 0,
                    heartSprites.frameWidth, heartSprites.frameHeight,
                    heart.x - gameState.cameraX,
                    heart.y,
                    30, 30
                );
            }
        }
    });
}

// Level başlangıcında kalpleri sıfırla
function resetLevel() {
    const currentLevel = levels[gameState.currentLevel - 1];
    if (currentLevel.hearts) {
        currentLevel.hearts.forEach(heart => {
            heart.collected = false;
        });
    }
}

// UI'ı çiz
function drawUI() {
    // Can göstergesi
    for(let i = 0; i < 5; i++) {
        const x = 10 + i * 25; // Daha yakın aralıklarla
        const y = 10;
        
        if (uiSprites.healthIndicator.complete) {
            if (i < heroine.lives) {
                ctx.drawImage(uiSprites.healthIndicator, x, y, 20, 20); // Biraz daha küçük
            } else {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(uiSprites.healthIndicator, x, y, 20, 20);
                ctx.globalAlpha = 1.0;
            }
        }
    }
}

// Kamera ayarları
function updateCamera() {
    const currentLevel = levels[gameState.currentLevel - 1];
    
    // Karakterin ekranın ortasında kalmasını sağla
    const targetX = heroine.x - canvas.width / 3;
    
    // Kameranın level sınırları içinde kalmasını sağla
    gameState.cameraX = Math.max(0, Math.min(targetX, currentLevel.levelWidth - canvas.width));
}

// Oyun döngüsü
function gameLoop() {
    if (currentGameState === GAME_STATES.STORY) {
        drawStoryScreen();
        requestAnimationFrame(gameLoop);
        return;
    }
    
    if (currentGameState === GAME_STATES.LEVEL_END) {
        drawLevelEndScreen();
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Kamerayı güncelle
    updateCamera();
    
    // Ekranı temizle
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mevcut leveli al
    const currentLevel = levels[gameState.currentLevel - 1];
    
    // Arka planı çiz
    try {
        // Arka plan görüntüsünü seç
        const bgImage = backgroundImages[`level${gameState.currentLevel}`];
        
        // Arka planı çiz
        if (bgImage && bgImage.complete) {
            const bgWidth = bgImage.width;
            const bgHeight = bgImage.height;
            const scale = Math.max(canvas.width / bgWidth, canvas.height / bgHeight);
            const scaledWidth = bgWidth * scale;
            const scaledHeight = bgHeight * scale;
            
            // Paralaks efekti için x pozisyonunu hesapla
            const parallaxX = (gameState.cameraX * 0.5) % scaledWidth;
            
            // İki arka plan görüntüsü çizerek sürekli bir efekt oluştur
            ctx.drawImage(bgImage, -parallaxX, 0, scaledWidth, scaledHeight);
            ctx.drawImage(bgImage, scaledWidth - parallaxX, 0, scaledWidth, scaledHeight);
        }
    } catch (error) {
        // Arka plan yüklenemezse varsayılan renk kullan
        ctx.fillStyle = '#87CEEB';  // Açık mavi
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Ana zemini çiz
    drawMainGround(currentLevel);
    
    // Karakter durumunu güncelle
    if (keys.right) {
        heroine.x += heroine.speed;
        heroineSprites.currentState = 'run';
        heroine.direction = 1;
    } else if (keys.left) {
        heroine.x -= heroine.speed;
        heroineSprites.currentState = 'run';
        heroine.direction = -1;
    } else {
        heroineSprites.currentState = 'idle';
    }

    if (heroine.isJumping) {
        heroineSprites.currentState = 'jump';
    }

    if (heroine.isAttacking) {
        heroineSprites.currentState = 'attack';
    }

    // Karakterin level sınırları içinde kalmasını sağla
    heroine.x = Math.max(0, Math.min(heroine.x, currentLevel.levelWidth - heroine.width));

    // Yerçekimi ve zıplama
    heroine.velocityY += gravity;
    heroine.y += heroine.velocityY;

    // Ana zeminle çarpışma kontrolü
    let onGround = checkMainGroundCollision(currentLevel);

    // Platform çarpışma kontrolü
    const currentLevelPlatforms = currentLevel.platforms;
    currentLevelPlatforms.forEach(platform => {
        if (checkCollision(heroine, platform)) {
            // Platform üzerine düşerken çarpışma
            if (heroine.velocityY > 0) {
                // Karakteri platformun üstüne yerleştir
                heroine.y = platform.y - heroine.height;
                heroine.velocityY = 0;
                heroine.isJumping = false;
                onGround = true;
            }
        } else {
            // Eğer karakter platformun üzerindeyken platformdan çıktıysa
            const characterCenter = heroine.x + (heroine.width / 2);
            if (characterCenter < platform.x || characterCenter > platform.x + platform.width) {
                if (heroine.y + heroine.height <= platform.y) {
                    heroine.isJumping = true;
                }
            }
        }
    });

    // Düşman çarpışma kontrolü
    checkEnemyCollision(currentLevel);

    // Saldırı çarpışma kontrolü
    checkAttackCollision(currentLevel);

    // Düşmanları güncelle ve çiz
    updateEnemies(currentLevel);
    drawEnemies(currentLevel);

    // Kalpleri çiz ve topla
    drawAndCollectHearts();

    // UI'ı çiz
    drawUI();

    // Hazine sandığını kontrol et ve çiz
    checkTreasureChest(currentLevel);
    drawTreasureChest(currentLevel);

    // Kedileri güncelle ve çiz
    if (currentLevel.cats) {
        currentLevel.cats.forEach(cat => {
            if (cat.type === 'cakil') {
                updateCat(cat, cats.cakil);
                drawCat(cat, cats.cakil);
            } else if (cat.type === 'gumus') {
                updateCat(cat, cats.gumus);
                drawCat(cat, cats.gumus);
            }
        });
    }

    // Boss'u güncelle ve çiz
    if (gameState.currentLevel === 3) {  // Son bölümde
        updateBoss(currentLevel);
        drawBoss(currentLevel);
        drawSavedGuy(currentLevel);  // Kurtarılan kişiyi çiz
    }

    // Eğer hiçbir yere değmiyorsa zıplama durumunda olmalı
    if (!onGround) {
        heroine.isJumping = true;
    }

    // Zıplama tuşu kontrolü
    if (keys.up && !heroine.isJumping) {
        heroine.velocityY = heroine.jumpForce;
        heroine.isJumping = true;
    }

    // Düşme kontrolü
    if (heroine.y > canvas.height) {
        // Karakter düştü, canını azalt ve başlangıç noktasına koy
        heroine.lives--;
        if (heroine.lives > 0) {
            heroine.x = 50;
            heroine.y = 700 - heroine.height; // Zemin yüksekliğinden karakter boyunu çıkarıyoruz
        } else {
            // Oyun bitti
            alert('ÖP');
            resetGame(); // Oyunu sıfırla
        }
    }

    // Animasyon güncelleme
    heroineSprites.frameTimer++;
    if (heroineSprites.frameTimer >= heroineSprites.frameDelay) {
        heroineSprites.frameTimer = 0;
        const currentAnim = heroineSprites[heroineSprites.currentState];
        currentAnim.currentFrame = (currentAnim.currentFrame + 1) % currentAnim.frames.length;
    }

    // Karakteri çiz
    const currentAnim = heroineSprites[heroineSprites.currentState];
    const currentFrame = currentAnim.frames[currentAnim.currentFrame];
    
    try {
        ctx.save();
        if (heroine.direction === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentFrame,
                -heroine.x + gameState.cameraX - heroine.width, heroine.y,
                heroine.width, heroine.height
            );
        } else {
            ctx.drawImage(
                currentFrame,
                heroine.x - gameState.cameraX, heroine.y,
                heroine.width, heroine.height
            );
        }
        ctx.restore();
    } catch (error) {
        // Sprite yüklenmediyse veya hata varsa kare çiz
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(
            heroine.x - gameState.cameraX,
            heroine.y,
            heroine.width,
            heroine.height
        );
    }

    // Platformları çiz
    currentLevelPlatforms.forEach(platform => {
        drawPlatform(platform);
    });

    // Kapıyı çiz
    const goal = currentLevel.goal;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(
        goal.x - gameState.cameraX,
        goal.y,
        goal.width,
        goal.height
    );

    // Oyun durumunu kontrol et
    checkGameState();

    // Oyun durumu mesajları
    if (gameState.gameOver) {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', canvas.width/2 - 100, canvas.height/2);
    } else if (gameState.gameWon) {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('ÖP!', canvas.width/2 - 100, canvas.height/2);
    }

    requestAnimationFrame(gameLoop);
}

// Oyun durumunu kontrol et
function checkGameState() {
    // Karakter öldü mü?
    if (heroine.y > canvas.height) {
        heroine.lives--;
        if (heroine.lives <= 0) {
            gameOver();
        } else {
            respawnAtCheckpoint();
        }
    }

    // Bölüm sonu kontrolü
    const currentLevel = levels[gameState.currentLevel - 1];
    if (checkCollision(heroine, currentLevel.goal)) {
        completeLevel();
    }
}

// Checkpoint'te yeniden doğ
function respawnAtCheckpoint() {
    if (gameState.checkPoint) {
        heroine.x = gameState.checkPoint.x;
        heroine.y = gameState.checkPoint.y;
    } else {
        heroine.x = 50;
        heroine.y = 700 - heroine.height; // Zemin yüksekliğinden karakter boyunu çıkarıyoruz
    }
    heroine.velocityY = 0;
    heroine.velocityX = 0;
    heroine.isJumping = false;
}

// Bölümü tamamla
function completeLevel() {
    gameState.currentLevel++;
    if (gameState.currentLevel > levels.length) {
        winGame();
    } else {
        loadLevel(gameState.currentLevel);
    }
}

// Oyunu sıfırla
function resetGame() {
    // Karakter durumunu sıfırla
    heroine.lives = 5;
    heroine.x = 50;
    heroine.y = 500;
    heroine.velocityY = 0;
    heroine.isJumping = false;
    heroine.direction = 1;
    heroine.isAttacking = false;
    heroine.lastAttackTime = 0;

    // Oyun durumunu sıfırla
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.cameraX = 0;

    // Animasyon durumunu sıfırla
    heroineSprites.currentState = 'idle';
    heroineSprites.currentFrame = 0;
    heroineSprites.frameTimer = 0;

    // Tuş durumlarını sıfırla
    for (let key in keys) {
        keys[key] = false;
    }
}

// Oyun bitti
function gameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '48px Arial';
    ctx.fillText('GAME OVER', canvas.width/2 - 100, canvas.height/2);
    
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Oyunu kazan
function winGame() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '48px Arial';
    ctx.fillText('YOU WIN!', canvas.width/2 - 100, canvas.height/2);
}

// Aktif bölümü yükle
function loadLevel(levelId) {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;
    
    // Karakteri başlangıç pozisyonuna koy
    if (gameState.checkPoint) {
        heroine.x = gameState.checkPoint.x;
        heroine.y = gameState.checkPoint.y;
    } else {
        heroine.x = 50;
        heroine.y = 700 - heroine.height; // Zemin yüksekliğinden karakter boyunu çıkarıyoruz
    }
    
    // Kamerayı sıfırla
    gameState.cameraX = 0;
}

// Sprite'ları yükle ve oyunu başlat
loadSprites();
loadLevel(gameState.currentLevel);
gameLoop();
