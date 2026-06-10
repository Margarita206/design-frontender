/**
 * Представление 3D шара
 * Отвечает за отрисовку сферы на canvas
 */
class SphereView {
    /**
     * Создает экземпляр представления шара
     * @param {HTMLCanvasElement} canvas - Canvas элемент для рисования
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
    }

    /**
     * Рисует 3D сферу с заданным углом поворота
     * @param {number} rotationDeg - Угол поворота в градусах
     */
    draw(rotationDeg) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 + 1;

        this.ctx.clearRect(0, 0, width, height);

        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const nx = (x - centerX) / radius;
                const ny = (y - centerY) / radius;
                const distance = Math.sqrt(nx * nx + ny * ny);

                if (distance <= 1) {
                    const nz = Math.sqrt(1 - distance * distance);
                    const radian = rotationDeg * Math.PI / 180;
                    const cos = Math.cos(radian);
                    const sin = Math.sin(radian);
                    const rotatedX = nx * cos + nz * sin;

                    let r, g, b;

                    // Определение цвета в зависимости от поворота
                    if (rotatedX < 0) {
                        // Красная сторона
                        r = 255;
                        g = 0;
                        b = 0;
                    } else {
                        // Зеленая сторона
                        r = 0;
                        g = 255;
                        b = 0;
                    }

                    // Расчет освещения и теней
                    const shade = 0.6 + 0.4 * (1 - distance * distance) + 0.2 * ny;
                    r = Math.min(255, Math.floor(r * shade));
                    g = Math.min(255, Math.floor(g * shade));
                    b = Math.min(255, Math.floor(b * shade));

                    // Добавление блика
                    const lightX = 0.5;
                    const lightY = -0.5;
                    const lightZ = 0.8;
                    const dotProduct = nx * lightX + ny * lightY + nz * lightZ;

                    if (dotProduct > 0.7) {
                        const specular = Math.min(255, Math.floor(80 * (dotProduct - 0.7) / 0.3));
                        r = Math.min(255, r + specular);
                        g = Math.min(255, g + specular);
                        b = Math.min(255, b + specular);
                    }

                    const pixelIndex = (y * width + x) * 4;
                    data[pixelIndex] = r;
                    data[pixelIndex + 1] = g;
                    data[pixelIndex + 2] = b;
                    data[pixelIndex + 3] = 255;
                } else {
                    // Область вне шара делаем прозрачной
                    const pixelIndex = (y * width + x) * 4;
                    data[pixelIndex + 3] = 0;
                }
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
}