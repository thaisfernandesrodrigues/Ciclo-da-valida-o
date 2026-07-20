// 🍓 Simulação do Ciclo da Validação - Desafio Fácil
// O moranguinho anda sozinho representando uma ideia em validação

// Quando a página carregar, inicia tudo
window.onload = function() {
    
    // Pega o canvas onde o morango vai ser desenhado
    var canvas = document.getElementById('canvas-morango');
    var ctx = canvas.getContext('2d');
    
    // Tamanho da área de jogo
    var LARGURA = 600;
    var ALTURA = 400;
    
    // ----- O MORANGUINHO (nossa ideia) -----
    // Ele usa posição e velocidade (tipo PVector do ProcessingJS)
    var morango = {
        pos: { x: 300, y: 200 },    // Posição atual
        vel: { x: 2.5, y: 1.8 },     // Velocidade (anda sozinho)
        tamanho: 30,                  // Tamanho do morango
        validacao: 0                  // Porcentagem de validação (começa em 0)
    };
    
    // ----- FUNÇÃO QUE DESENHA O MORANGO -----
    function desenharMorango(x, y, tam) {
        ctx.save();
        ctx.translate(x, y);
        
        // Sombra suave pro morango ficar bonitinho
        ctx.shadowColor = 'rgba(200, 50, 50, 0.2)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 3;
        
        // Desenha o corpo do morango (formato de coração)
        ctx.beginPath();
        ctx.moveTo(0, -tam);
        ctx.bezierCurveTo(-tam, -tam * 0.8, -tam * 1.2, tam * 0.2, 0, tam * 1.1);
        ctx.bezierCurveTo(tam * 1.2, tam * 0.2, tam, -tam * 0.8, 0, -tam);
        ctx.closePath();
        
        // Cor vermelha de morango
        ctx.fillStyle = 'rgb(255, 60, 80)';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgb(200, 40, 60)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Brilho pra dar vida ao morango
        ctx.beginPath();
        ctx.ellipse(-8, -10, 6, 8, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        // Folhinha no topo
        ctx.beginPath();
        ctx.ellipse(0, -tam - 4, tam * 0.3, tam * 0.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(60, 180, 60)';
        ctx.fill();
        
        // Sementinhas do morango
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
        }
        
        ctx.restore();
    }
    
    // ----- FUNÇÃO QUE DESENHA O CENÁRIO -----
    function desenharCenario() {
        // Fundo com gradiente rosa
        var grad = ctx.createRadialGradient(300, 200, 50, 300, 200, 400);
        grad.addColorStop(0, '#fff5f5');
        grad.addColorStop(1, '#ffd6d6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, LARGURA, ALTURA);
        
        // Corações decorativos no fundo
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ff6b8a';
        var coracoes = [
            [50, 50, 18], [550, 60, 15],
            [80, 360, 12], [520, 340, 16],
            [300, 30, 22]
        ];
        for (var i = 0; i < coracoes.length; i++) {
            var d = coracoes[i];
            ctx.beginPath();
            ctx.arc(d[0], d[1], d[2], 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        
        // Texto no rodapé
        ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
        ctx.font = 'italic 13px Arial';
        ctx.fillText('🍓 Observando o ciclo de validação...', 20, 385);
    }
    
    // ----- FUNÇÃO QUE ATUALIZA O MOVIMENTO -----
    function atualizarMorango() {
        // Move o morango de acordo com a velocidade
        morango.pos.x += morango.vel.x;
        morango.pos.y += morango.vel.y;
        
        // Verifica se bateu nas bordas e faz quicar
        var raio = morango.tamanho;
        
        // Borda esquerda e direita
        if (morango.pos.x - raio < 0) {
            morango.pos.x = raio;
            morango.vel.x *= -1;  // Inverte a direção
        }
        if (morango.pos.x + raio > LARGURA) {
            morango.pos.x = LARGURA - raio;
            morango.vel.x *= -1;
        }
        
        // Borda de cima e de baixo
        if (morango.pos.y - raio < 0) {
            morango.pos.y = raio;
            morango.vel.y *= -1;
        }
        if (morango.pos.y + raio > ALTURA) {
            morango.pos.y = ALTURA - raio;
            morango.vel.y *= -1;
        }
    }
    
    // ----- FUNÇÃO QUE MOSTRA AS INFORMAÇÕES NA TELA -----
    function desenharInfo() {
        // Mostra a posição do morango
        ctx.fillStyle = 'rgba(100, 50, 60, 0.5)';
        ctx.font = '11px Arial';
        ctx.fillText('🍓 Posição: ' + Math.round(morango.pos.x) + ', ' + Math.round(morango.pos.y), 15, 25);
        
        // Mostra a velocidade
        ctx.fillText('⚡ Velocidade: ' + Math.round(morango.vel.x * 10) / 10 + ', ' + Math.round(morango.vel.y * 10) / 10, 15, 45);
    }
    
    // ----- LOOP PRINCIPAL DA ANIMAÇÃO -----
    // Essa função roda várias vezes por segundo, criando a animação
    function loop() {
        desenharCenario();      // Desenha o fundo
        atualizarMorango();     // Calcula a nova posição
        desenharMorango(morango.pos.x, morango.pos.y, morango.tamanho);  // Desenha o morango
        desenharInfo();         // Mostra as informações
        
        requestAnimationFrame(loop);  // Chama o próximo frame
    }
    
    // Inicia a simulação
    loop();
    
    // Mensagem no console pra saber que deu certo
    console.log('🍓 Simulação iniciada! O moranguinho está andando.');
};