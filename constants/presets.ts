import type {
  BezierPoint,
  SymmetrySettings,
  ColorSettings,
  BezierPath,
} from '@/models/types'

interface Preset {
  name: string
  image: string
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  colorSettings: ColorSettings
}

const presets: Preset[] = [
  {
    name: 'Itachi',
    image: '/Itachi.png',
    bezierPaths: [
      {
        points: [
          {
            x: 51,
            y: 110,
            cp1x: 20,
            cp1y: 110,
            cp2x: 82,
            cp2y: 110,
          },
          {
            x: 299,
            y: 158,
            cp1x: 229,
            cp1y: 49,
            cp2x: 219,
            cp2y: 131,
          },
          {
            x: 127,
            y: 202,
            cp1x: 140,
            cp1y: 142,
            cp2x: 175,
            cp2y: 186,
          },
        ],
        color: '#000000',
      },
    ],
    symmetrySettings: {
      axes: 3,
    },
    colorSettings: {
      pupilColor: '#B20000',
      pupilSize: 0.14,
    },
  },

  {
    name: 'Shisui',
    image: '/Shisui.png',
    bezierPaths: [
      {
        points: [
          {
            x: 101,
            y: 27,
            cp1x: 20,
            cp1y: 110,
            cp2x: 196,
            cp2y: 78,
          },
          {
            x: 299,
            y: 158,
            cp1x: 215,
            cp1y: 92,
            cp2x: 202,
            cp2y: 149,
          },
          {
            x: 101,
            y: 150,
            cp1x: 257,
            cp1y: 155,
            cp2x: 77,
            cp2y: 215,
          },
        ],
        color: '#000000',
      },
      {
        points: [
          {
            x: 99,
            y: 101,
            cp1x: 109,
            cp1y: 67,
            cp2x: 161,
            cp2y: 101,
          },
          {
            x: 99,
            y: 198,
            cp1x: 161,
            cp1y: 199,
            cp2x: 74,
            cp2y: 249,
          },
        ],
        color: '#B20000',
      },
    ],
    symmetrySettings: {
      axes: 4,
    },
    colorSettings: {
      pupilColor: '#000000',
      pupilSize: 0.08,
    },
  },
]

export default presets
