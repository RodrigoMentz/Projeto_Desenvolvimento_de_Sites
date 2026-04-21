document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("hero-video");
    const heroSection = document.getElementById("hero");
    
    let isVideoReady = false;
    let duration = 0;

    // Quando os metadados do vídeo carregam
    video.addEventListener("loadedmetadata", () => {
        duration = video.duration;
        // Calcular posição inicial do vídeo
        updateVideoTime(true);
    });

    // Ocultar o "piscar" e exibir de forma suave via classe 'ready'
    video.addEventListener("seeked", () => {
        if (!isVideoReady) {
            isVideoReady = true;
            video.classList.add("ready");
        }
    });

    // Forçar o cálculo caso o loadedmetadata demore (fallback)
    if (video.readyState >= 1) {
        duration = video.duration;
        updateVideoTime(true);
    }

    // Caso a propriedade de vídeo já esteja no state >= 2, mostra logo
    if (video.readyState >= 2) {
        if (!isVideoReady) {
            isVideoReady = true;
            video.classList.add("ready");
        }
    }

    // Função de cálculo de tempo baseado no scroll
    function updateVideoTime(isInitial = false) {
        if (isNaN(duration) || duration === 0) return;

        // scrollTop do documento
        const scrollTop = window.scrollY || window.pageYOffset;
        // Altura total da hero section
        const heroHeight = heroSection.offsetHeight;
        // A área scrollável real é a altura total menos a altura da janela
        const scrollableHeight = heroHeight - window.innerHeight;
        
        // Calcular a fração do scroll dentro da hero section
        // Math.min e Math.max para garantir que o valor fique entre 0 e 1
        let scrollFraction = scrollTop / scrollableHeight;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        // Calcular tempo no modo REVERSO:
        // Quando scrollFraction é 0 (topo), time = duration
        // Quando scrollFraction é 1 (fim do hero), time = 0
        const time = duration * (1 - scrollFraction);

        // Atualizar currentTime
        // Se estiver num frame diferente, pede atualização
        if (Math.abs(video.currentTime - time) > 0.05 || isInitial) {
            video.currentTime = time;
        }
    }

    // Listener de scroll otimizado com requestAnimationFrame
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateVideoTime();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Fix: Para garantir que o vídeo esteja carregado (safari/iOS workaround)
    video.load();

    // Menu Hamburguer
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links li a");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
});
