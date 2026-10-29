/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterProfile } from '../types/comic';

export const CHARACTERS_DATA: Record<string, CharacterProfile> = {
  laisha: {
    id: 'laisha',
    name: 'Laisha',
    nickname: 'La mamá sabia',
    species: 'perrita',
    role: 'Perrita Pastor Ganadero y mamá de Merlina',
    tagline: 'No necesita ladrar: te dice todo con su mirada sabia y tranquila.',
    themeColor: {
      bg: 'bg-amber-100',
      border: 'border-amber-800',
      accent: 'text-amber-800',
      badgeBg: 'bg-amber-200 text-amber-900 border-amber-400',
      lightBg: 'bg-amber-50',
    },
    appearance: {
      collarColor: 'Rosa coral con dije brillante',
      superpower: 'Mirada de rayos X: sabe si traes una galleta escondida en el bolsillo.',
      lookDescription: 'Pelaje suave moteado en gris azulado con manchas negras, patitas color canela y orejas picudas siempre atentas.',
    },
    funFacts: {
      favoriteActivity: 'Observar todo desde su tapete como una reina zen y cuidar a Ceci.',
      favoriteSnack: 'Cualquier pedacito de manzana o premio de premio que caiga de la mesa.',
      funnyHabit: 'Suspira hondo cuando Jorge dice que van a salir a correr diez kilómetros.',
      favoriteThought: '«Te estoy mirando, Jorge... y los dos sabemos que esa galleta no era para ti».',
    },
  },

  merlina: {
    id: 'merlina',
    name: 'Merlina',
    nickname: 'El torbellino feliz',
    species: 'perrita',
    role: 'Hija de Laisha y campeona de saltos',
    tagline: '¡Experta en saltar cercas y regalar lengüetazos a la velocidad del rayo!',
    themeColor: {
      bg: 'bg-teal-100',
      border: 'border-teal-800',
      accent: 'text-teal-800',
      badgeBg: 'bg-teal-200 text-teal-900 border-teal-400',
      lightBg: 'bg-teal-50',
    },
    appearance: {
      collarColor: 'Verde menta brillante',
      superpower: 'Patas de resorte: salta cualquier reja con una voltereta cómica.',
      lookDescription: 'Manto azul moteado, máscara negra como de antifaz de superhéroe y lengua rosada casi siempre de fuera.',
    },
    funFacts: {
      favoriteActivity: 'Dormir sobre el lomo del sillón como si fuera un gato gigante mientras Jorge ve la tele.',
      favoriteSnack: 'Cualquier juguete que chille o pelota de tenis que rebote alto.',
      funnyHabit: 'Ladrarle a las moscas como si fueran dragones voladores.',
      favoriteThought: '«¡Papá se sentó! ¡Alerta roja, desplieguen el protocolo de abrazos con baba!».',
    },
  },

  ceci: {
    id: 'ceci',
    name: 'Ceci',
    nickname: 'La protectora',
    species: 'humano',
    role: 'Mamá humana de la casa',
    tagline: 'Dijo «nada de perros en la casa» y hoy Laisha es su consentida número uno.',
    themeColor: {
      bg: 'bg-rose-100',
      border: 'border-rose-800',
      accent: 'text-rose-800',
      badgeBg: 'bg-rose-200 text-rose-900 border-rose-400',
      lightBg: 'bg-rose-50',
    },
    appearance: {
      superpower: 'Detectar travesuras antes de que ocurran.',
      lookDescription: 'Cabello rizado largo castaño, lentes redondos brillantes y la sonrisa más cariñosa de la casa.',
    },
    funFacts: {
      favoriteActivity: 'Acariciar las orejitas de Laisha mientras toma té en la sala.',
      favoriteSnack: 'Fruta fresca y café con leche.',
      funnyHabit: 'Esperar a Jorge en la puerta con los brazos cruzados preguntando qué pasó en el parque.',
      favoriteThought: '«¿Cuándo será el día en que Jorge entre por esa puerta sin una historia insólita?».',
    },
  },

  jorge: {
    id: 'jorge',
    name: 'Jorge',
    nickname: 'El papá optimista',
    species: 'humano',
    role: 'Papá humano y paseador oficial',
    tagline: '«Tranquila Ceci, tengo a las perritas 100% bajo control» (casi nunca es cierto).',
    themeColor: {
      bg: 'bg-emerald-100',
      border: 'border-emerald-800',
      accent: 'text-emerald-800',
      badgeBg: 'bg-emerald-200 text-emerald-900 border-emerald-400',
      lightBg: 'bg-emerald-50',
    },
    appearance: {
      superpower: 'Optimismo infinito: cree que hoy sí aprenderán a no perseguir palomas.',
      lookDescription: 'Sonrisa simpática, playera deportiva verde y tenis listos para trotar hacia el parque.',
    },
    funFacts: {
      favoriteActivity: 'Lanzar la pelota en el pasto del parque y ver a Merlina correr como cohete.',
      favoriteSnack: 'Tacos los domingos después de un buen paseo.',
      funnyHabit: 'Hablarle a las perritas como si fueran cadetes de una academia espacial.',
      favoriteThought: '«¡Hoy sí se van a portar como soldaditos!... (espero que no haya ardillas)».',
    },
  },
};
