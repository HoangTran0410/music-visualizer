export function makeElementDraggableAndResizeable(
  element,
  onChange = () => {},
  onChangeFinish = () => {}
) {
  element.classList.add("drag-resize-able");
  element.style.left = element.offsetLeft + "px";
  element.style.top = element.offsetTop + "px";

  let pos = {
    x: element.offsetLeft,
    y: element.offsetTop,
    w: element.offsetWidth,
    h: element.offsetHeight,
  };

  // ==================== draggable ====================
  element.addEventListener("mousedown", startDrag);

  let isDragged = false;

  function startDrag(e) {
    e.preventDefault();
    console.log("start drag", element);
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialLeft = element.offsetLeft;
    const initialTop = element.offsetTop;

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);

    function doDrag(event) {
      event.preventDefault();
      if (isResizing) return;
      pos.x = initialLeft + event.clientX - initialX;
      pos.y = initialTop + event.clientY - initialY;
      isDragged = true;
      update();
    }

    function stopDrag(event) {
      console.log("stop drag", element);
      event.preventDefault();
      if (isDragged) {
        console.log("change finish", pos, element);
        onChangeFinish(pos, element);
      }
      isDragged = false;
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
  }

  // ==================== resizable ====================
  let isResizing = false,
    resizeStartPos,
    resizeDirection;

  const resizeHandles = document.createElement("div");
  resizeHandles.classList.add("resize-handles");
  element.appendChild(resizeHandles);

  const names = [
    // corners
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    // edges
    "top",
    "bottom",
    "left",
    "right",
  ];
  names.forEach((name) => {
    const handler = document.createElement("div");
    handler.classList.add("resize-handle", name);
    resizeHandles.appendChild(handler);

    handler.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      resizeStartPos = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
      };
      resizeDirection = name;
    });

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  });

  function update() {
    element.style.width = `${pos.w}px`;
    element.style.height = `${pos.h}px`;
    element.style.left = `${pos.x}px`;
    element.style.top = `${pos.y}px`;

    onChange(pos, element);
  }

  function mousemove(e) {
    if (isResizing) {
      const { x, y, w, h, mouseX, mouseY } = resizeStartPos;
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      if (resizeDirection.includes("top")) {
        pos.y = y + deltaY;
        pos.h = h - deltaY;
      }
      if (resizeDirection.includes("left")) {
        pos.x = x + deltaX;
        pos.w = w - deltaX;
      }
      if (resizeDirection.includes("bottom")) {
        pos.h = h + deltaY;
      }
      if (resizeDirection.includes("right")) {
        pos.w = w + deltaX;
      }

      pos.w = Math.max(20, pos.w);
      pos.h = Math.max(20, pos.h);

      update();
    }
  }

  function mouseup() {
    isResizing = false;
    onChangeFinish(pos, element);
  }

  return {
    rollback() {
      element.classList.remove("drag-resize-able");
      element.removeEventListener("mousedown", startDrag);
      resizeHandles.remove();
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    },
  };
}
