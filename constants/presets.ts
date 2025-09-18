import {
  type BezierPoint,
  type SymmetrySettings,
  type ColorSettings,
  type BezierPath,
  type SavedDesign,
  ShapeType,
} from '@/models/types'

type Preset = Omit<
  SavedDesign,
  'name' | 'timestamp' | 'animationSpeed' | 'bezierPaths'
> & {
  id: string
  image: string
  bezierPaths?: BezierPath[]
}

const presets: Preset[] = [
  {
    id: 'Itachi',
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
    id: 'Shisui',
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

  {
    id: 'Kakashi',
    image: '/Kakashi.png',
    shapes: [
      {
        type: ShapeType.BEZIER,
        color: '#000000',
        id: '6yd68sv9a',
        points: [
          {
            x: 136,
            y: 189,
            cp1x: 165,
            cp1y: 228,
            cp2x: 202,
            cp2y: 119,
          },
          {
            x: 255,
            y: 9,
            cp1x: 219,
            cp1y: 106,
            cp2x: 161,
            cp2y: 37,
          },
          {
            x: 67,
            y: 111,
            cp1x: 146,
            cp1y: 48,
            cp2x: 82,
            cp2y: 79,
          },
        ],
      },
      {
        type: ShapeType.BEZIER,
        color: '#000000',
        id: '2470bmjxe',
        points: [
          {
            x: 249,
            y: 19,
            cp1x: 144.30555196901022,
            cp1y: 81.35532255623343,
            cp2x: 262,
            cp2y: 124,
          },
          {
            x: 145,
            y: 280,
            cp1x: 227,
            cp1y: 235,
            cp2x: 181,
            cp2y: 237,
          },
          {
            x: 210,
            y: 107,
            cp1x: 229,
            cp1y: 194,
            cp2x: 173,
            cp2y: 86,
          },
        ],
      },
    ],
    symmetrySettings: {
      axes: 3,
    },
    colorSettings: {
      pupilColor: '#B20000',
      pupilSize: 0.18,
    },
  },
]

export default presets
