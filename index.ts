interface Circle {
  x: number;
  y: number;
  r: number;
}

const generateLogo = (): Circle[] => {
  const elements: Circle[] = [];
  for (let i = 0; i < 256; i++) {
    const inverseSize = 1 - Math.pow(i + 7, -0.47);
    let circle = {
      r: 1 - inverseSize,
      x: (Math.random() - 0.5) * inverseSize,
      y: (Math.random() - 0.5) * inverseSize,
    };
    let [touching, conflictCircle] = isTouchingAny(circle, elements);
    if (touching) {
      for (let j = 0; j < 4 && touching; j++) {
        circle = tryFixCircle(circle, conflictCircle);
        [touching, conflictCircle] = isTouchingAny(circle, elements);
      }
    }
    if (!touching) elements.push(circle);
  }
  return elements;
}

const isTouchingAny = (circle: Circle, elements: Circle[]): [boolean, Circle] => {
  if (isOutside(circle)) return [true, circle];
  for (let i = 0; i < elements.length; i++)
    if (isTouching(circle, elements[i])) return [true, elements[i]];
  return [false, circle];
}

const isOutside = (circle: Circle): boolean => {
  const distanceToEdge = Math.sqrt(Math.pow(circle.x, 2) + Math.pow(circle.y, 2));
  return 0.5 - circle.r * 0.5 - 0.01 < distanceToEdge;
}

const isTouching = (circleOne: Circle, circleTwo: Circle): boolean => {
  return (
    Math.pow(circleOne.x - circleTwo.x, 2) +
      Math.pow(circleOne.y - circleTwo.y, 2) <=
    0.01 + Math.pow((circleOne.r + circleTwo.r) / 2, 2)
  );
}

const tryFixCircle = (circleMain: Circle, circleOther: Circle): Circle => {
  if (circleMain === circleOther) {
    const escapeAngle = Math.atan2(circleMain.y, circleMain.x);
    circleMain.x = Math.cos(escapeAngle) * (circleMain.r * 0.5 - 0.01);
    circleMain.y = Math.sin(escapeAngle) * (circleMain.r * 0.5 - 0.01);
  } 
  else {
    const escapeAngle = Math.atan2( circleMain.y - circleOther.y, circleMain.x - circleOther.x);
    circleMain.x =
      Math.cos(escapeAngle) * (circleMain.r + circleOther.r + 0.04) * 0.5 +
      circleOther.x;
    circleMain.y =
      Math.sin(escapeAngle) * (circleMain.r + circleOther.r + 0.04) * 0.5 +
      circleOther.y;
  }
  return circleMain;
}
