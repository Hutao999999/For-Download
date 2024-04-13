export default {
  data: {
    wraps: {
      test: {
        name: "test",
        type: "directory",
        admin: false,
        under: {
          awa: {
            name: "awa",
            type: "wrap",
            admin: false,
            location: {
              x: 0,
              y: -60,
              z: 0,
            },
            dimension: "overworld",
            rotation: {
              x: 0,
              y: 0
            }
          }
        }
      },
      bwb: {
        name: "bwb",
        type: "wrap",
        admin: true,
        location: {
          x: 0,
          y: 0,
          z: 0,
        },
        dimension: "overworld",
        rotation: {
          x: 0,
          y: 0
        }
      }
    }
  }
}

export const database = "hutao:wrap";