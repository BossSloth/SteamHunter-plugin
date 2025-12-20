import { constSysfsExpr, findClass } from '@steambrew/client';
import React from 'react';

let achievementsStyles = constSysfsExpr('achievements.css', { basePath: '../../public' }).content;
const steamClassNames = [...achievementsStyles.matchAll(/\.__(\w+)__/g)];
steamClassNames.forEach((className) => {
  if (className[1] === undefined) return;
  const realClassName = findClass(className[1]) as string;
  achievementsStyles = achievementsStyles.replaceAll(className[0], `.${realClassName}`);
});

export function Styles(): React.JSX.Element {
  return <style>{achievementsStyles}</style>;
}
