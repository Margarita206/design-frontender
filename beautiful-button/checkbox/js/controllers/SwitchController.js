/**
 * Контроллер переключателя
 * Управляет взаимодействием между моделью и представлением
 */
class SwitchController {
    /**
     * Создает экземпляр контроллера
     * @param {SphereModel} model - Модель шара
     * @param {SphereView} view - Представление шара
     * @param {HTMLElement} container - DOM элемент переключателя
     * @param {HTMLElement} trackFill - Элемент заливки трека
     * @param {HTMLElement} ballCanvas - Контейнер шара
     */
    constructor(model, view, container, trackFill, ballCanvas) {
        this.model = model;
        this.view = view;
        this.container = container;
        this.trackFill = trackFill;
        this.ballCanvas = ballCanvas;
        this.isProcessing = false;
        this.isActive = false;
        this.animationFrameId = null;

        this.init();
    }

    /**
     * Инициализация контроллера
     */
    init() {
        this.setupEventListeners();
        this.startAnimationLoop();
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        this.container.addEventListener('click', () => this.handleToggle());
        window.addEventListener('resize', () => this.updateFillWidth());
    }

    /**
     * Запуск основного цикла анимации
     */
    startAnimationLoop() {
        const animate = () => {
            if (this.model.getIsAnimating()) {
                this.model.updateRotation();
                this.view.draw(this.model.getCurrentRotation());
                this.updateFillWidth();
            }
            this.animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Обновление ширины заливки трека в зависимости от позиции шара
     */
    updateFillWidth() {
        const computedStyle = window.getComputedStyle(this.ballCanvas);
        const transform = computedStyle.transform;

        let translateX = 0;

        if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ');
                if (values.length === 6) {
                    translateX = parseFloat(values[4]);
                }
            }
        }

        const ballCenter = translateX + 45;
        let fillPercent = (ballCenter / 180) * 100;
        fillPercent = Math.min(100, Math.max(0, fillPercent));

        this.trackFill.style.width = fillPercent + '%';
    }

    /**
     * Обработка клика по переключателю с защитой от быстрых нажатий
     */
    handleToggle() {
        if (this.isProcessing || this.model.getIsAnimating()) return;

        this.isProcessing = true;
        this.container.classList.add('disabled');

        this.isActive = !this.isActive;
        this.container.classList.toggle('active');

        const targetRotation = this.isActive ? 90 : 270;
        this.model.rotateTo(targetRotation);

        // Разблокировка после завершения анимации
        const checkAnimationComplete = () => {
            if (!this.model.getIsAnimating()) {
                this.isProcessing = false;
                this.container.classList.remove('disabled');
            } else {
                setTimeout(checkAnimationComplete, 50);
            }
        };
        checkAnimationComplete();
    }

    /**
     * Остановка анимационного цикла (для очистки ресурсов)
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}