import React from 'react';

export const HeroNameMap = {
  electrician: 'chatterjee'
};

export const CustomHeroImage = {
  electrician: "https://raw.githubusercontent.com/OpenAngelArena/oaa/master/content/panorama/images/heroes/npc_dota_hero_electrician.png",
  sohei: "https://raw.githubusercontent.com/OpenAngelArena/oaa/master/content/panorama/images/heroes/npc_dota_hero_sohei.png",
};

export function imgUrlForHero(hero) {
  if (hero.startsWith('npc_dota_hero_')) {
    hero = hero.substr(14);
  }

  if (CustomHeroImage[hero]) {
    return CustomHeroImage[hero];
  }
  return `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero}.png`
}

export function heroName(hero) {
  if (hero.startsWith('npc_dota_hero_')) {
    hero = hero.substr(14);
  }

  if (HeroNameMap[hero]) {
    hero = HeroNameMap[hero];
  }

  return hero
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => {
      if (!part || !part.length) {
        return part;
      }
      return part[0].toUpperCase() + part.substr(1).toLowerCase();
    })
    .join(' ');
}

export default function HeroIcon(props) {
  const { hero, ...otherProps } = props;
  let finalHero = hero;

  if (finalHero.startsWith('npc_dota_hero_')) {
    finalHero = finalHero.substr(14);
  }

  return (
    <img
      {...otherProps}
      src={imgUrlForHero(finalHero)}
      alt={finalHero}
    />
  );
}
