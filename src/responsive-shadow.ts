/**
 * To a rendered DOM Element, adds a text shadow that orients based on mouse
 * position in the document.
 */
class ResponsiveShadowText {
  element: HTMLElement;
  shadowRadius: number;
  debouncedHandleMouseMove: (e: MouseEvent) => void;

  /**
   * Constructs the responsive shadow and adds listener for mousemove
   * @param {HTMLElement} el the rendered element to apply the shadow to
   * @param {number} shadowRadius maximum x or y text shadow offset
   */
  constructor(el: HTMLElement, shadowRadius: number = 6) {
    this.element = el;
    this.shadowRadius = shadowRadius;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.debouncedHandleMouseMove = debounce(this.handleMouseMove, 8);
    document.addEventListener('mousemove', this.debouncedHandleMouseMove);
  }

  /**
   * Gets the center point [x, y] of the element
   */
  get centerPoint() {
    const x = this.element.offsetLeft + this.element.offsetWidth * 0.5;
    const y = this.element.offsetTop + this.element.offsetHeight * 0.5;
    return [x, y];
  }

  /**
   * Modifies the element's text-shadow style
   * @param {number} offsetX horizontal shadow offset in px, positive positions shadow to the right
   * @param {number} offsetY vertical shadow offset in px, positive positions shadow below
   */
  updateShadow(offsetX: number, offsetY: number) {
    this.element.style.textShadow = `${offsetX}px ${offsetY}px 0 rgba(0, 0, 0, 0.2)`;
  }

  /**
   * Orients element's text shadow based on mouse position
   * @param {MouseEvent} e mouse event
   */
  handleMouseMove(e: MouseEvent) {
    const { clientX: mouseX, clientY: mouseY } = e;
    const [textCenterX, textCenterY] = this.centerPoint;

    const angle = angleBetweenTwoPoints(
      [textCenterX, textCenterY],
      [mouseX, mouseY]
    );

    const [offsetX, offsetY] = sides(angle, this.shadowRadius);

    this.updateShadow(offsetX, offsetY);
  }

  /**
   * Removes the mouse move event listener from the document
   */
  removeListener() {
    document.removeEventListener('mousemove', this.debouncedHandleMouseMove);
  }
}
