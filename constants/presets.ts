import type {
  BezierPoint,
  SymmetrySettings,
  ColorSettings,
} from '@/components/sharingan-designer'

interface Preset {
  name: string
  bezierPaths: BezierPoint[][]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
}

const presets: Preset[] = [
  {
    name: '鼬',
    bezierPaths: [
      [
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
    ],
    symmetrySettings: {
      axes: 3,
    },
    animationSpeed: [0],
    colorSettings: {
      pupilColor: '#e70808',
      pathFillColor: '#000000',
      pupilSize: 0.14,
    },
  },
  {
    name: '止水',
    bezierPaths: [
      [
        {
          x: 102,
          y: 41,
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
      [
        {
          x: 101,
          y: 91,
          cp1x: 101,
          cp1y: 84,
          cp2x: 186,
          cp2y: 89,
        },
        {
          x: 104,
          y: 209,
          cp1x: 185,
          cp1y: 208,
          cp2x: 74,
          cp2y: 249,
        },
      ],
    ],
    symmetrySettings: {
      axes: 4,
    },
    animationSpeed: [0],
    colorSettings: {
      pupilColor: '#B20000',
      pathFillColor: '#000000',
      pupilSize: 0.2,
    },
  },
]

export default presets
