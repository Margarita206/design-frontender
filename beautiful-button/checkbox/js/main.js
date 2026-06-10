/**
 * Главный модуль
 * Инициализирует все компоненты переключателя
 */
(function() {
    // Получение DOM элементов
    const canvas = document.getElementById('sphereCanvas');
    const trackFill = document.querySelector('.track-fill');
    const ballCanvas = document.querySelector('.ball-canvas');
    const container = document.getElementById('toggleSwitch');

    // Проверка наличия необходимых элементов
    if (!canvas || !trackFill || !ballCanvas || !container) {
        console.error('Не удалось найти необходимые DOM элементы');
        return;
    }

    // Создание экземпляров Model и View
    const sphereModel = new SphereModel(270);
    const sphereView = new SphereView(canvas);

    // Первоначальная отрисовка
    sphereView.draw(270);

    // Создание и запуск контроллера
    const controller = new SwitchController(
        sphereModel,
        sphereView,
        container,
        trackFill,
        ballCanvas
    );

    // Обработка ошибок
    window.addEventListener('error', (e) => {
        console.warn('Произошла ошибка:', e.error);
    });
})();