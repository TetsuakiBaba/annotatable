module.exports = {
  packagerConfig: {
    "icon": "src/images/icon",
    asar: true,
    osxSign: {

    },
    "osxNotarize": {
      "tool": "notarytool",
      "appBundleId": "annotatable",
      "appleId": "microhost@gmail.com",
      "appleIdPassword": "szna-zrlv-cjpl-vuje",
      "teamId": "ZE8M4T49DP",
    }
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: ['darwin', 'win32'],
      config: {
        repository: {
          owner: 'TetsuakiBaba',
          name: 'annotatable',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],

  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
