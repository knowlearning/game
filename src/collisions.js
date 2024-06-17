const collisions = {
  LineLine: (o1, o2) => {
    // Line-line collision detection
    const { x1: x1, y1: y1, x2: x2, y2: y2 } = o1;
    const { x1: x3, y1: y3, x2: x4, y2: y4 } = o2;

    const denominator = ((x4 - x3) * (y2 - y1)) - ((x2 - x1) * (y4 - y3));
    if (denominator === 0) return false; // Lines are parallel

    const ua = (((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1))) / denominator;
    const ub = (((x4 - x3) * (y3 - y1)) - ((y4 - y3) * (x3 - x1))) / denominator;

    return (ua > 0 && ua < 1 && ub > 0 && ub < 1);
  },

  CircleLine: (o1, o2) => {
    // Circle-line collision detection
    const { x: cx, y: cy, r } = o1;
    const { x1, y1, x2, y2 } = o2;

    const A = cx - x1;
    const B = cy - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = (len_sq !== 0) ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = cx - xx;
    const dy = cy - yy;
    return (dx * dx + dy * dy) <= r * r;
  },

  LineCircle: (o1, o2) => collisions.CircleLine(o2, o1),

  CircleCircle: (o1, o2) => {
    // Circle-circle collision detection
    const { x: x1, y: y1, r: r1 } = o1;
    const { x: x2, y: y2, r: r2 } = o2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= (r1 + r2);
  }
}

export default collisions