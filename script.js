// ============================================
// 🍓 DESAFIO FÁCIL - MORANGUINHO ANDANTE
// ============================================

// ===== ESPERA A PÁGINA CARREGAR =====
window.onload = function() {
    
    // ===== PEGA O CANVAS E O CONTEXTO =====
    var canvas = document.getElementById('canvas-morango');
    var ctx = canvas.getContext('2d');
    
    // ===== DIMENSÕES DO CANVAS =====
    var LARGURA = 600;
    var ALTURA = 400;
    
    // =====================================
    // 1. OBJETO MORANGUINHO (A IDEIA)
    // =====================================
    var morango = {
        // Posição (PVector no ProcessingJS)
        pos: {
            x: 300,
            y: 200
        },
        // Velocidade (PVector no ProcessingJS)
        vel: {
            x: 2.5,   // <-- MOVIMENTO CONTÍNUO (anda sozinho)
            y: 1.8    // <-- MOVIMENTO CONTÍNUO (anda sozinho)
        },
        // Aceleração (PVector no ProcessingJS)
        acc: {
            x: 0,
            y: 0
        },
        // Atributos
        tamanho: 30,
        cor: [255, 60, 80],
        validacao: 0
    };
    
    // ===== FORÇA DE ATRITO =====
    var ATRITO = 0.98;
    var FORCA_MAXIMA = 4;
    var ACELERACAO_TECLA = 0.4;
    
    // ===== TECLAS PRESSIONADAS =====
    var teclas = {
        cima: false,
        baixo: false,
        esquerda: false,
        direita: false
    };
    
    // =====================================
    // 2. FUNÇÃO PARA DESENHAR O MORANGO
    // =====================================
    function desenharMorango(x, y, tam) {
        ctx.save();
        ctx.translate(x, y);
        
        // --- SOMBRA ---
        ctx.shadowColor = 'rgba(200, 50, 50, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 3;
        
        // --- CORPO (formato de coração/morango) ---
        ctx.beginPath();
        ctx.moveTo(0, -tam);
        ctx.bezierCurveTo(-tam, -tam * 0.8, -tam * 1.2, tam * 0.2, 0, tam * 1.1);
        ctx.bezierCurveTo(tam * 1.2, tam * 0.2, tam, -tam * 0.8, 0, -tam);
        ctx.closePath();
        
        // Preenche o morango
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgb(255, 60, 80)';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgb(200, 40, 60)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // --- BRILHO (destaque) ---
        ctx.beginPath();
        ctx.ellipse(-8, -10, 6, 8, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        // --- FOLHINHA NO TOPO ---
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.ellipse(0, -tam - 4, tam * 0.3, tam * 0.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(60, 180, 60)';
        ctx.fill();
        
        // Detalhe da folhinha
        ctx.beginPath();
        ctx.ellipse(-3, -tam - 6, 4, 3, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(80, 200, 80)';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(3, -tam - 6, 4, 3, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(80, 200, 80)';
        ctx.fill();
        
        // --- SEMENTINHAS ---
        ctx.shadowBlur = 0;
        var sementes = [
            [-8, -6], [8, -6],
            [-12, 2], [0, 0], [12, 2],
            [-8, 10], [8, 10],
            [0, 16]
        ];
        
        for (var i = 0; i < sementes.length; i++) {
            ctx.beginPath();
            ctx.ellipse(sementes[i][0], sementes[i][1], 2.5, 2, 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgb(255, 220, 80)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(200, 170, 50, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // =====================================
    // 3. FUNÇÃO PARA DESENHAR O CENÁRIO
    // =====================================
    function desenharCenario() {
        // --- FUNDO GRADIENTE ---
        var grad = ctx.createRadialGradient(300, 200, 50, 300, 200, 400);
        grad.addColorStop(0, '#fff5f5');
        grad.addColorStop(0.5, '#ffe8e8');
        grad.addColorStop(1, '#ffd6d6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, LARGURA, ALTURA);
        
        // --- PADRÃO DE FUNDO (bolinhas discretas) ---
        ctx.globalAlpha = 0.1;
        for (var i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(
                20 + (i % 10) * 62,
                20 + Math.floor(i / 10) * 130,
                3, 0, Math.PI * 2
            );
            ctx.fillStyle = '#ff6b8a';
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        
        // --- CORAÇÕES DECORATIVOS ---
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#ff6b8a';
        
        var decoracoes = [
            [50, 50, 18],
            [550, 60, 15],
            [80, 360, 12],
            [520, 340, 16],
            [300, 30, 22],
            [30, 200, 10],
            [570, 210, 10]
        ];
        
        for (var i = 0; i < decoracoes.length; i++) {
            var d = decoracoes[i];
            ctx.beginPath();
            ctx.arc(d[0], d[1], d[2], 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        
        // --- TEXTO NO RODAPÉ ---
        ctx.fillStyle = 'rgba(255, 150, 150, 0.5)';
        ctx.font = 'italic 14px Arial';
        ctx.fillText('🍓 Validando ideias...', 20, 385);
        
        // --- BORDA DECORATIVA ---
        ctx.strokeStyle = 'rgba(255, 150, 150, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 10]);
        ctx.strokeRect(10, 10, LARGURA - 20, ALTURA - 20);
        ctx.setLineDash([]);
    }
    
    // =====================================
    // 4. ATUALIZAR MORANGUINHO (COM VETORES)
    // =====================================
    function atualizarMorango() {
        // --- RESETA ACELERAÇÃO ---
        morango.acc.x = 0;
        morango.acc.y = 0;
        
        // --- APLICA FORÇAS DAS TECLAS (interação) ---
        if (teclas.cima) morango.acc.y = -ACELERACAO_TECLA;
        if (teclas.baixo) morango.acc.y = ACELERACAO_TECLA;
        if (teclas.esquerda) morango.acc.x = -ACELERACAO_TECLA;
        if (teclas.direita) morango.acc.x = ACELERACAO_TECLA;
        
        // --- APLICA FORÇA DE ATRITO (sempre presente) ---
        morango.vel.x *= ATRITO;
        morango.vel.y *= ATRITO;
        
        // --- SE NÃO TIVER TECLA, APLICA UMA FORÇA LEVE (vento) ---
        // Isso garante movimento contínuo mesmo sem interação!
        if (!teclas.cima && !teclas.baixo && !teclas.esquerda && !teclas.direita) {
            // Força de "vento" suave que muda lentamente
            morango.vel.x += Math.sin(Date.now() / 3000) * 0.02;
            morango.vel.y += Math.cos(Date.now() / 4000) * 0.02;
        }
        
        // --- LIMITA VELOCIDADE MÁXIMA ---
        var velMax = FORCA_MAXIMA;
        if (morango.vel.x > velMax) morango.vel.x = velMax;
        if (morango.vel.x < -velMax) morango.vel.x = -velMax;
        if (morango.vel.y > velMax) morango.vel.y = velMax;
        if (morango.vel.y < -velMax) morango.vel.y = -velMax;
        
        // --- ATUALIZA POSIÇÃO (PVector) ---
        morango.pos.x += morango.vel.x;
        morango.pos.y += morango.vel.y;
        
        // --- BORDAS (quicar/não sair) ---
        var raio = morango.tamanho;
        
        // Borda esquerda
        if (morango.pos.x - raio < 0) {
            morango.pos.x = raio;
            morango.vel.x = Math.abs(morango.vel.x) * 0.8; // Inverte e perde um pouco
        }
        // Borda direita
        if (morango.pos.x + raio > LARGURA) {
            morango.pos.x = LARGURA - raio;
            morango.vel.x = -Math.abs(morango.vel.x) * 0.8;
        }
        // Borda superior
        if (morango.pos.y - raio < 0) {
            morango.pos.y = raio;
            morango.vel.y = Math.abs(morango.vel.y) * 0.8;
        }
        // Borda inferior
        if (morango.pos.y + raio > ALTURA) {
            morango.pos.y = ALTURA - raio;
            morango.vel.y = -Math.abs(morango.vel.y) * 0.8;
        }
    }
    
    // =====================================
    // 5. DESENHAR INFORMAÇÕES NA TELA
    // =====================================
    function desenharInfo() {
        // --- POSIÇÃO ---
        ctx.fillStyle = 'rgba(100, 50, 60, 0.7)';
        ctx.font = '12px Arial';
        ctx.fillText('🍓 Posição: ' + Math.round(morango.pos.x) + ', ' + Math.round(morango.pos.y), 15, 25);
        
        // --- VELOCIDADE ---
        ctx.fillStyle = 'rgba(100, 50, 60, 0.5)';
        ctx.fillText('⚡ Velocidade: ' + Math.round(morango.vel.x * 10) / 10 + ', ' + Math.round(morango.vel.y * 10) / 10, 15, 45);
        
        // --- CONTROLES ---
        ctx.fillStyle = 'rgba(100, 50, 60, 0.4)';
        ctx.font = '11px Arial';
        ctx.fillText('⬆⬇⬅➡  Movimente | O morango anda sozinho!', 15, 65);
        
        // --- VALIDAÇÃO (barra) ---
        var barraX = 15;
        var barraY = 80;
        var barraW = 150;
        var barraH = 14;
        
        // Fundo da barra
        ctx.fillStyle = 'rgba(255, 200, 200, 0.4)';
        ctx.roundRect ? ctx.roundRect(barraX, barraY, barraW, barraH, 7) : null;
        ctx.fillRect(barraX, barraY, barraW, barraH);
        
        // Progresso
        var progresso = Math.min(100, morango.validacao);
        var grad = ctx.createLinearGradient(barraX, barraY, barraX + barraW, barraY);
        grad.addColorStop(0, '#ff4466');
        grad.addColorStop(0.5, '#ff6688');
        grad.addColorStop(1, '#ff88aa');
        ctx.fillStyle = grad;
        ctx.fillRect(barraX + 2, barraY + 2, (progresso / 100) * (barraW - 4), barraH - 4);
        
        // Borda da barra
        ctx.strokeStyle = 'rgba(200, 60, 80, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barraX, barraY, barraW, barraH);
        
        // Texto da barra
        ctx.fillStyle = 'rgba(100, 50, 60, 0.7)';
        ctx.font = '9px Arial';
        ctx.fillText('🍓 Validação: ' + Math.round(progresso) + '%', barraX + 8, barraY + 11);
    }
    
    // =====================================
    // 6. LOOP PRINCIPAL (DRAW)
    // =====================================
    function loop() {
        // 1. Desenha o cenário
        desenharCenario();
        
        // 2. Atualiza a posição (física)
        atualizarMorango();
        
        // 3. Desenha o moranguinho
        desenharMorango(morango.pos.x, morango.pos.y, morango.tamanho);
        
        // 4. Desenha informações
        desenharInfo();
        
        // 5. Próximo frame
        requestAnimationFrame(loop);
    }
    
    // =====================================
    // 7. EVENTOS DE TECLADO (INTERAÇÃO)
    // =====================================
    document.addEventListener('keydown', function(event) {
        var tecla = event.key;
        
        // Previne scroll da página
        if (tecla === 'ArrowUp' || tecla === 'ArrowDown' || 
            tecla === 'ArrowLeft' || tecla === 'ArrowRight') {
            event.preventDefault();
        }
        
        // Ativa teclas
        if (tecla === 'ArrowUp') teclas.cima = true;
        if (tecla === 'ArrowDown') teclas.baixo = true;
        if (tecla === 'ArrowLeft') teclas.esquerda = true;
        if (tecla === 'ArrowRight') teclas.direita = true;
    });
    
    document.addEventListener('keyup', function(event) {
        var tecla = event.key;
        
        // Desativa teclas
        if (tecla === 'ArrowUp') teclas.cima = false;
        if (tecla === 'ArrowDown') teclas.baixo = false;
        if (tecla === 'ArrowLeft') teclas.esquerda = false;
        if (tecla === 'ArrowRight') teclas.direita = false;
    });
    
    // =====================================
    // 8. INICIA A SIMULAÇÃO
    // =====================================
    loop();
    
    console.log('🍓 Desafio Fácil - Moranguinho Andante');
    console.log('✅ Movimento contínuo com PVector');
    console.log('✅ Interação com teclado');
    console.log('✅ Força de atrito aplicada');
    console.log('🚀 Simulação iniciada com sucesso!');
};