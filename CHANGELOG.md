## [2.0.1](https://github.com/BossSloth/SteamHunter-plugin/compare/v2.0.0...v2.0.1) (2026-01-26)


### Bug Fixes

* Fixed ErrorDisplay not working due to too early of a return ([b9c8c27](https://github.com/BossSloth/SteamHunter-plugin/commit/b9c8c279e3ad81c50c690c6601a5bf63baaa33c6))

# [2.0.0](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.3.1...v2.0.0) (2026-01-25)


### Features

* added achievement tags, player count and guide links to achievements. Closes [#12](https://github.com/BossSloth/SteamHunter-plugin/issues/12) ([67b6f5e](https://github.com/BossSloth/SteamHunter-plugin/commit/67b6f5ea83c9ca48747770d578304688a780dcd5))
* added toggle for temp hltb data ([e6bd28c](https://github.com/BossSloth/SteamHunter-plugin/commit/e6bd28c940197dcc3e282dc889204a88cf9974aa)), closes [#22](https://github.com/BossSloth/SteamHunter-plugin/issues/22)
* Massive refactor of code and added preferences ui ([c2d0cb0](https://github.com/BossSloth/SteamHunter-plugin/commit/c2d0cb046172336fa037be563245b8ef5856eda3))
* redesigned the header to be more modern and have an consistent look ([dac6869](https://github.com/BossSloth/SteamHunter-plugin/commit/dac68694ce80312f8abb5210b8daa6d58f3becdd))
* refactor backend fully to lua and inject styles better ([ed28eec](https://github.com/BossSloth/SteamHunter-plugin/commit/ed28eeca2fdd2aa60c7fc8e1b6724c897471014b))
* reload achievement page data on achievement obtained ([6262d9a](https://github.com/BossSloth/SteamHunter-plugin/commit/6262d9a75fba975e01813ecc30b9d683776dab9e))
* show obtainability as tag ([b50c76d](https://github.com/BossSloth/SteamHunter-plugin/commit/b50c76d5f0cca4dd1af24e42649898ab0f79c4c1))
* updated readme, images and also added new images for preferences and Big Picture Mode ([c3b3d02](https://github.com/BossSloth/SteamHunter-plugin/commit/c3b3d02b9ab236bb4d08ae13f4da21979e931785))


### Performance Improvements

* improved performance slightly ([d15b2d9](https://github.com/BossSloth/SteamHunter-plugin/commit/d15b2d962b446838853b1730dfe30c035c61937e))


### BREAKING CHANGES

* This changes how preferences are saved and isn't compatible with the old way. So all previous preferences will be lost

## [1.3.1](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.3.0...v1.3.1) (2025-10-05)


### Bug Fixes

* Fixed some games failing on parsing json because of weird characters ([366b78a](https://github.com/BossSloth/SteamHunter-plugin/commit/366b78a42d1ba3fbaecb3bb1cf6aebdf5eb8f351))

# [1.3.0](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.6...v1.3.0) (2025-09-21)


### Features

* open achievement groups tab by default ([497209e](https://github.com/BossSloth/SteamHunter-plugin/commit/497209eb0bcc05a0039bda70037389c8f53d7453))
* temporarily add augmented steam HLTB times to game details section ([55181ff](https://github.com/BossSloth/SteamHunter-plugin/commit/55181ffbfe1d10f5a89b6c50564547065b2a781e))

## [1.2.6](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.5...v1.2.6) (2025-09-14)


### Bug Fixes

* Fixed achievements group tab sometimes not appearing, it now appear 100% of the time ([f1a6135](https://github.com/BossSloth/SteamHunter-plugin/commit/f1a61351223d8d74487ae55184bbaf9c9924d4e4))

## [1.2.5](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.4...v1.2.5) (2025-05-10)


### Bug Fixes

* Fixed achievement tab crashing if image cache wasn't fully loaded yet on some games, closes [#11](https://github.com/BossSloth/SteamHunter-plugin/issues/11) ([24a3967](https://github.com/BossSloth/SteamHunter-plugin/commit/24a3967504e00da3a927d877c09797fb41f2703f))

## [1.2.4](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.3...v1.2.4) (2025-04-14)


### Bug Fixes

* add metadata.json to release zip ([bcb107d](https://github.com/BossSloth/SteamHunter-plugin/commit/bcb107d3f86dfc90a8a9dd62776b6ca7944b5c0d))

## [1.2.3](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.2...v1.2.3) (2025-04-12)


### Bug Fixes

* Group header image not working on newer games (was broken on newer games released starting circa march) ([497b794](https://github.com/BossSloth/SteamHunter-plugin/commit/497b794c37a971dd48e1269576091cd5522691dc))
* progress bar spacing not being consistent between groups, closes [#10](https://github.com/BossSloth/SteamHunter-plugin/issues/10) ([ae6b45e](https://github.com/BossSloth/SteamHunter-plugin/commit/ae6b45ef918b4806c56a2c7fdd4e5cd0f4d19765))

## [1.2.2](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.1...v1.2.2) (2025-03-29)


### Bug Fixes

* don't provide name to logger ([c066e44](https://github.com/BossSloth/SteamHunter-plugin/commit/c066e449a47fe63e7c88dcb341f864b322bdb0b2))

## [1.2.1](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.2.0...v1.2.1) (2025-03-22)


### Bug Fixes

* Unauthorized error by updating api data and removing date released from groups ([4a74469](https://github.com/BossSloth/SteamHunter-plugin/commit/4a74469cf781f46382d93d496b237eb9d47fb720)), closes [#7](https://github.com/BossSloth/SteamHunter-plugin/issues/7)

# [1.2.0](https://github.com/BossSloth/SteamHunter-plugin/compare/v1.1.0...v1.2.0) (2025-03-20)


### Bug Fixes

* **#6:** show proper error page when api server is unreachable ([900d35b](https://github.com/BossSloth/SteamHunter-plugin/commit/900d35b79049ee6653fb9f239ef375f162241ff9)), closes [#6](https://github.com/BossSloth/SteamHunter-plugin/issues/6)


### Features

* **#3:** show progress bar on achievement groups ([382ea3a](https://github.com/BossSloth/SteamHunter-plugin/commit/382ea3a3615350a8569501c1ba2f1d2a86f20c97)), closes [#3](https://github.com/BossSloth/SteamHunter-plugin/issues/3)
* **#4:** group by only dlc ([d201891](https://github.com/BossSloth/SteamHunter-plugin/commit/d201891b54626c37d7789aa4aec8ae92e9ff2f8f)), closes [#4](https://github.com/BossSloth/SteamHunter-plugin/issues/4)
* **#4:** sort by unlocked date ([1fd16a2](https://github.com/BossSloth/SteamHunter-plugin/commit/1fd16a264213156fa9ac26effbe28d7c623133d6)), closes [#4](https://github.com/BossSloth/SteamHunter-plugin/issues/4)
* **#5:** highlight unlocked achievements with green and added unlocked date ([bf631c0](https://github.com/BossSloth/SteamHunter-plugin/commit/bf631c0a353d283d1077e66057549978eec00217)), closes [#5](https://github.com/BossSloth/SteamHunter-plugin/issues/5)

# [1.1.0](https://github.com/tddebart/SteamHunter-plugin/compare/v1.0.0...v1.1.0) (2025-02-23)


### Features

* **#1:** Added big picture support and full controller support ([9a044ef](https://github.com/tddebart/SteamHunter-plugin/commit/9a044ef33f432db133f5d90bbe058d6043858d66)), closes [#1](https://github.com/tddebart/SteamHunter-plugin/issues/1)
* **#2:** Added ability to set/save default settings ([1f964f2](https://github.com/tddebart/SteamHunter-plugin/commit/1f964f282fe09acf68dc7fb61f8815957feeed8c)), closes [#2](https://github.com/tddebart/SteamHunter-plugin/issues/2)
