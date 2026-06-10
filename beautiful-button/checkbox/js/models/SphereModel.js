/**
 * Модель 3D шара
 * Управляет состоянием и логикой вращения сферы
 */
class SphereModel {
    /**
     * Создает экземпляр модели шара
     * @param {number} initialRotation - Начальный угол поворота в градусах
     */
    constructor(initialRotation = 270) {
        this.currentRotation = initialRotation;
        this.targetRotation = initialRotation;
        this.isAnimating = false;
        this.animationStartTime = 0;
        this.startRotation = 0;
        this.animationDuration = 1000;
        this.animationFrameId = null;
    }

    /**
     * Запускает анимацию вращения к целевому углу
     * @param {number} targetDeg - Целевой угол в градусах
     */
    rotateTo(targetDeg) {
        if (this.isAnimating) return;

        this.targetRotation = targetDeg;
        this.startRotation = this.currentRotation;
        this.animationStartTime = performance.now();
        this.isAnimating = true;
    }

    /**
     * Получает прогресс анимации с применением easing-функции
     * @returns {number} Прогресс анимации (0-1)
     */
    getAnimationProgress() {
        if (!this.isAnimating) return 1;

        const elapsed = performance.now() - this.animationStartTime;
        let progress = Math.min(1, elapsed / this.animationDuration);

        return progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    }

    /**
     * Обновляет текущий угол поворота на основе прогресса анимации
     */
    updateRotation() {
        if (!this.isAnimating) return;

        const progress = this.getAnimationProgress();
        const delta = this.targetRotation - this.startRotation;
        this.currentRotation = this.startRotation + delta * progress;

        if (progress >= 1) {
            this.currentRotation = this.targetRotation;
            this.isAnimating = false;
        }
    }

    /**
     * Возвращает текущий угол поворота
     * @returns {number}
     */
    getCurrentRotation() {
        return this.currentRotation;
    }

    /**
     * Проверяет, идет ли анимация
     * @returns {boolean}
     */
    getIsAnimating() {
        return this.isAnimating;
    }

    /**
     * Устанавливает callback для завершения анимации
     * @param {Function} callback - Функция, вызываемая по завершении анимации
     */
    onAnimationComplete(callback) {
        const checkComplete = () => {
            if (!this.isAnimating) {
                callback();
            } else {
                setTimeout(checkComplete, 16);
            }
        };
        checkComplete();
    }
}