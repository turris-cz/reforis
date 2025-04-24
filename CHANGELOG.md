# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.5.0] - 2025-04-24

### Added

- Added & updated Weblate translations
- Added ntfy support for notifications
- Add Tamil and Traditional Chinese language support in LanguagesDropdown

### Changed

- Sorted languages list in LanguagesDropdown
- Updated several dependencies in package.json
- Refactored email notification settings
- Refactored TestNotification to be unified for email & push notifications
- NPM audit fix

### Removed

- Removed fsevents from package-lock.json

## [3.4.0] - 2025-03-12

### Added

- Added & updated Weblate translations
- Added link to docs in sidebar main navigation

### Changed

- Updated Foris JS library to version 6.7.0
- Improved table styles in dark mode
- Fixed actionMethod in FactoryReset component
- Refactored static leases again
- NPM audit fix

## [3.3.0] - 2025-02-28

### Added

- Added & updated Weblate translations
- Added Port Forwarding page with basic functionality
- Added peer dependency for @tanstack/react-table
- Added Changelog and License sections to README.md

### Changed

- WiFi API update
- Refactored DismissAllButton
- Updated Foris JS library to version 6.6.1
- Updated several dependencies in package.json
- Updated Node.js setup script to use version 22.x
- Refactored DHCP clients list with static leases

### Removed

- Removed pkg_resources and replaced with importlib

## [3.2.1] - 2024-12-05

### Changed

- Created & updated translation messages
- Wrapped expiration text in span elements for improved rendering
- Refactored Portal usage in DHCP clients components
- Refactored session timeout handling with alert context

## [3.2.0] - 2024-11-29

### Added

- Added & updated Weblate translations

### Changed

- Updated Foris JS library to v6.5.0
- Updated reforis_screenshot.png
- Fixed table text color in dark mode
- Refactored OpenVPNCard on Overview page
- Refactored LibrespeedCard component
- Refactored DHCP client tables to use RichTable component for improved display
- Refactored FactoryReset and Reboot to use ActionButtonWithModal component
- Refactored LanguageDropdown to use language names instead of codes
- Updated ThreatDetectionCard to allow optional isInstalled prop
- Renamed "Dark Mode" to "Theme" in dropdown header

## [3.1.1] - 2024-10-22

### Added

- Added & updated Weblate translations

### Changed

- Refactored interface class and icon styling
- Refactored DynamicFirewallCard and ThreatDetectionCard
- Refactored NavigationItem component to handle mobile screen resizing

## [3.1.0] - 2024-10-09

### Added

- Added & updated Weblate translations
- Added animations for alerts to app.css
- Added useSessionTimeout hook and SessionTimeoutModal component
- Added missing icons to FontAwesome icons library

### Changed

- Updated Foris JS library to v6.4.0
- Updated Browserslist DB
- Updated SkipGuideButton styles to be less expressive
- Updated branding to reForis in codebase
- Refactored Overview Cards
- Refactored ConnectionTest component
- Refactored Main.js to use useSessionTimeout hook
- Refactored top-bar.html to add margin-bottom for mobile view
- Refactored NetMetr card to LibreSpeed card
- Refactored CSS styles to use variable for primary color
- Refactored SkipGuideButton to use a modal for skipping guide
- Fixed theme handleMediaChange to handle favicon change
- Other small improvements

## [3.0.0] - 2024-09-05

### Added

- Added & updated Weblate translations
- Added fontAwesomeIcons library
- Added congrats emoji to GuideFinish heading
- Added SkipLink component for accessibility improvement

### Changed

- Migrated to React FontAwesome v6
- Fixed dark mode flickering screen
- Fixed navigation collapse on mobile
- Fixed Guide layout on different screen sizes
- Updated Foris JS library to v6.1.0
- Updated theme context to handle favicon change and improve initialization
- Refactored app.scss to match common Turris Bootstrap theme
- Refactored GuideHelper & GuideControls components
- Refactored Interface component
- Refactored ErrorBoundary component and removed unused CSS
- NPM audit fix

### Removed

- Removed obsolete styles & refactored icons

## [2.1.0] - 2024-08-05

### Added

- Added & updated Weblate translations
- Added third state for test connection results
- Added Dark Mode to the TopBar

### Changed

- Migrated to Bootstrap v5.3.x
- Fixed building of the JS docs
- Fixed processing DHCP lease time units
- Fixed navigation sections collapse
- Replaced Pylint & Pycodestyle for Ruff
- Replaced online Lato font with a local one
- Refactored Notification API
- Refactored Notifications component
- Refactored update_reboot_settings function in updater.py
- Updated Foris JS library to v6.0.3
- Updated FontAwesome library to v6.5.2
- Other improvements
- NPM audit fix

### Removed

- Removed required attribute from new MAC address input

## [2.0.0] - 2024-02-23

### Added

- Added & updated Weblate translations

### Changed

- Updated Webpack to v5 & plugins to latest versions
- Updated dependencies
- Updated Node.js version to v21 in Makefile
- Updated eslint-config-reforis to v2.1.1
- Updated CI to use shared scripts, build and publish python package
- Fixed heading font sizes
- Fixed crashed API request on the Hostname page
- Fixed reForis to be compatible with Flask 2.3
- Split Webpack JS bundle into main and vendor
- Changed build system to hatch
- Pinned Flask 2.x

### Removed

- Removed acorn-dynamic-import dependency
- Moved reForis Dockerfile to foris-ci
- Unpinned werkzeug

## [1.5.0] - 2024-01-09

### Added

- Added & updated Weblate translations
- Added custom reforis image for CI/CD
- Added node-sass & sass-loader
- Added & wrapped content with CustomizationContext

### Changed

- Refactored Main page & use CustomizationContext
- Used CustomizationContext on About page
- Updated Foris JS library to v5.6.0
- Updated eslint, prettier, eslint-config-reforis
- Used custom reforis-image in GitLab CI
- Unpinned Flask-Babel and applied some changes so it can run in TOS 7.X
- Logging fixes
- NPM audit fix
- Some other changes & improvements

### Removed

- Dropped pylint-quotes

## [1.4.1] - 2022-12-12

### Added

- Added & updated Weblate translations
- Added mac address to SelectedInterface
- Displayed interfaces with VLAN ID on Interfaces page

## [1.4.0] - 2022-12-02

### Added

- Added & updated Weblate translations
- Added VLAN form to the WAN page
- Added switch to disable Management Frame Protection (802.11w)

### Changed

- Updated Foris JS library to v5.5.0
- Updated node image to v16.x
- Restructured Guide Finish page
- Refactored StaticLeases table
- Refactored ConnectionTest
- NPM audit fix
- Some other changes & improvements

### Removed

- Removed redundant endpoint for HaaS
- Removed optional watch-poll parameter in package.json

## [1.3.1] - 2022-08-01

### Added

- Added & updated translations

### Changed

- Fixed client-relative session expiration
- NPM audit fix

## [1.3.0] - 2022-06-03

### Added

- Added & updated translations
- Added ability to set static leases

### Changed

- Fixed language and parsing for points.js
- Updated Foris JS library to v5.4.1
- Updated pip in virtualenv to latest version
- Moved ubus socket path
- Made WS path in lighttpd mode configurable
- Changed author email in setup.py
- NPM audit fix
- Other small improvements

## [1.2.1] - 2022-03-10

### Added

- Added & updated translations
- Added ESLint import plugin to sort imports correctly
- Added Python interactive debugging guide
- Added webpack-bundle-analyzer
- Added new-password autocomplete attribute to password inputs
- Added CHANGELOG filled with existed tags & info

### Changed

- Improved handling of loading translations
- Refined Makefile
- Updated required NodeJS version to 14.x
- Updated Python image to v3.10.2
- Updated Node.js image to v14
- Updated Foris JS library to v5.3.0
- Updated several NPM dependencies
- Fixed translation messages strings
- Fixed uninitialized guideData
- Fixed typos and inconsistencies on the Packages page
- Fixed grammar and spelling mistakes in many places
- Fixed messages.pot template's header comment
- Fixed reForis react-styleguidist docs build
- Fixed sorting of countries by name
- NPM audit fix
- Other small improvements

### Removed

- Removed hardcoded setuptools version
- Removed obsolete auth section from reForis docs
- Replaced domain validation with hostname

## [1.2.0] - 2021-12-15

### Changed

- Aligned submenu navigation items to the left on desktop
- Updated Foris JS library to v5.2.0

### Removed

- Removed login page

## [1.1.4] - 2021-12-14

### Added

- Added & updated translations
- Added test which checks whether js sources can be built

### Changed

- Fixed MQTT custom port
- Fixed simplebar-react dependency
- Fixed time expiration for static leases in DHCP tables

## [1.1.3] - 2021-11-15

- NPM audit fix

## [1.1.2] - 2021-11-09

- Add external link to UserOptions
- Improve intro description of Packages
- Provide info whether user is logged in to JS
- Add & update translations
- Add light/dark favicon switch
- backend.py: new linter version requires encoding
- Fix python linting f-string errors
- Rename Data Collection card to Threat Detection
- Don't set socket when starting WSGIServer
- Respond with 401 and rename the file
- NPM audit fix

## [1.1.1] - 2021-07-01

- Fix LAN page saving

## [1.1.0] - 2021-07-01

- Add & update translations
- Add MAC address to WAN page
- Add IPv6 DHCP clients table
- Fix test connection results for screen readers
- Update Foris JS to version 5.1.13
- NPM audit fix
- Other small improvements

## [1.0.8] - 2021-05-19

- Add Alert if no Wi-Fi cards are connected
- Add CustomizationContext to the Main component
- Add CustomizationContext to the Guide component
- Refactor customization check on Password page
- Refactor customization check on LAN page
- Get rid of error message on redirect to login page
- Fix displaying of Turris Shield name in About
- Fix Guide on Turris 1.x
- Update Foris JS library to v5.1.12
- NPM Audit fix
- Other small improvements

## [1.0.7] - 2021-04-27

- Add & update translations
- Improve Password Form
- Fix root password on Shield
- Fix cards on the Overview page
- Disable LAN mode in LAN Settings on Shield
- NPM audit fix
- Other small UI improvements

## [1.0.6] - 2021-04-13

- Add TLS explanation
- Add & update translations
- Add DNS tests to the card on Overview
- Fix Guide on Turris Shield
- Fix unknown initial state for automatic updates
- Fix unknown initial state for WAN IPv4 settings
- Fix fuzzy translation messages in the English catalog
- Update session.samesite cookie
- NPM audit fix
- Other small improvements

## [1.0.5] - 2021-03-10

- Improve Updater behavior
- Add & update translations
- Add hostname settings
- Add password confirmation
- Add env variables to Makefile
- Fix redirect to the original router's IP address
- Fix WAN 6in4 tunnel MTU range to 1480
- Fix public IPv4 input as not required in WAN6Form
- Drop versions of paho-mqtt & extras dependencies
- Other small improvements

## [1.0.4] - 2021-01-18

- Add syslog settings
- Fix IPv6 prefix as not required
- Fix headings structure on multiple pages
- Fix formFieldsSize structure of multiple cards
- Fix several typos and messages in texts
- Update Foris JS to version 5.1.11
- Update & add new translations
- Remove spinner on Main page
- Remove duplicated Norwegian language
- Remove SimpleBar's autoHide parameter

## [1.0.3] - 2020-12-08

- Add device customizations
- Add missing copyrights
- Fix Overview cards PropTypes
- Fix DHCP range configuration
- Change page title to reForis

## [1.0.2] - 2020-12-02

- Add factory reset
- Rename "Reboot" tab to "Maintenance"
- Fix auto replacing FontAwesome SVGs
- Fix Overview cards
- Fix custom SMTP form
- Improve texts and styles
- Update & add translations
- Update Foris JS library to v5.1.7
- Update README.md & add CONTRIBUTING.md

## [0.9.5] - 2020-11-20

- Fixes custom mail server

## [1.0.1] - 2020-10-29

- Reduce requests on "notifications" endpoint
- Add redirect checkbox
- Add versioned stylesheets
- Improve texts
- Fix logout button

## [0.99.4-shield] - 2020-10-01

- Fix reForis version for Shield variant
- NPM audit fix
- Update snapshots

## [1.0.0] - 2020-09-25

- Use ForisJS v5.1.5
- Add switches
- Improve Guide
- Add URLs for packages
- Add Overview tests
- Add tests for Cards
- Add highlight for notifications
- Fix navigation collapse
- Fix Update Dropdown refresh
- Add react tooltips
- Add simplebar
- Improve sidebar with fixed logo
- Integrate Prettier + ESlint + reforis styleguide
- Add inline options to RadioSet
- Other small improvements

## [0.9.4] - 2020-09-14

## [0.9.9] - 2020-08-26

- Add Fluid Layout
- Fix navigation items order
- Add Guest Network warning

## [0.99.3.1-shield] - 2020-08-12

- Fix tests

## [0.9.3] - 2020-08-11

## [0.99.3-shield] - 2020-08-07

## [0.99.2-shield] - 2020-08-05

## [0.99.1-shield] - 2020-08-05

## [0.99.0-shield] - 2020-08-03

## [0.9.2] - 2020-08-03

## [shield-customization] - 2020-08-03

- Customization for Turris Shield

## [0.8.1] - 2020-06-02

## [0.9.1] - 2020-06-09

- Fix JS bundling.

## [0.9.0] - 2020-05-22

- Add user options in package management.
- Add sending testing email notification.
- Add labels to user options and package lists.
- Extract the language management into a separate page.
- Use ForisJS v5.0.0.
- Fix QR code PDF generation.
- Add and update translations.
- NPM audit fix.

## [0.8.0] - 2020-03-26

- Fix PDF QR code generation.
- Update ForisJS v4.5.0.

## [0.7.4] - 2020-03-23

- Limit for custom DNS forwarders IPv4 and IPv6 addresses.
- NPM audit fix.

## [0.7.3] - 2020-03-16

- Fix using multiple IP addresses for custom DNS forwarders.

## [0.7.2] - 2020-03-04

- Improve tests.
- Optimize CSS.
- Make menu collapsible on mobile devices.
- Get rid of using external fonts from CSS.
- Fix handling of empty controller_id.
- Fix a lot of typos.
- Improve finish page of wizard.
- Add "external" icon to LuCI link.
- Improve working with datetime.

## [0.7.1] - 2020-02-20

- Add error boundaries.
- Restrict LAN interfaces to have at least one interface in it.
- Fix exposing react-router-dom.

## [0.7.0] - 2020-02-17

- Use foris-js 3.4.0.
- Improve plugins integration into menu.
- Improve backend mock in tests.
- Extract Wi-Fi form to ForisJS.
- Support calling of specific controller.
- Expose react-router.
- Get rid of flask-sessions dependencies.
- Improve validation of DHCP settings.
- Display branch of TurrisOS in About page.
- Fix bug with repeated connection test.
- Fix "Importance" value in email notifications settings.
- Alert placement.
- Dropdown menu on small devices.
- Network restart handling.
- Setup MOX with one port.

## [0.6.2] - 2019-11-25

- Add translations.

## [0.6.1] - 2019-11-21

- Fix ccs build.

## [0.6.0] - 2019-11-20

- Use foris-js 1.3.2.
- Use API polling from forisjs in Updates.
- Update translations.
- Expose global AlertContext.
- Fix npm dependencies.

## [0.5.0] - 2019-11-15

- Custom DNS forwarders
- Manually check updates
- Fixed updating root password
- Fixed memory leak in notifications
- Improved error handling (alerts and API responses)
- Assets from npm packages: bootstrap and icons
- Shared eslint config

## [0.4.4] - 2019-10-03

- Add update approvals page.
- Use external forisjs library
- Use external distutils library
- Make translations worked in plugins

## [0.4.3] - 2019-08-30

- Add help text to guide pages.
- Extract forisjs library.
- A lot of small fixes.

## [0.4.2] - 2019-08-21

- Add reboot is required button.
- New plugin integration.
- Better eslinter rules.
- Bugfixes.

## [0.4.1] - 2019-08-07

- Fix guide navigation.
- Small codestyle fixes.

## [0.4.0] - 2019-08-06

- Use react-router.
- Improve guide.
- A lot of small bug fixes and changes.

## [0.3.6] - 2019-07-15

- Fix production bugs.

## [0.3.5] - 2019-07-12

- Fix translations typo.

## [0.3.4] - 2019-07-11

- Remove fixed versions from setup.py.

## [0.3.3] - 2019-07-10

- Translation compilation fix

## [0.3.2] - 2019-07-04

- Add csrf protection.
- Fix build.
- A lot of small changes.

## [0.3.1] - 2019-06-28

- Fix translations build.
- Add Python and JS docs.

## [0.3] - 2019-06-26

- Network interfaces page.
- DHCP clients list.
- Sketch of guide.
- Tests.
- fcgi server command.
- Fix a lot of bugs.

## [0.2.1] - 2019-05-03

## [0.2] - 2019-05-03

## [0.1] - 2019-02-14

- Initial version

[unreleased]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.5.0...master
[3.5.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.4.0...v3.5.0
[3.4.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.3.0...v3.4.0
[3.3.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.2.1...v3.3.0
[3.2.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.2.0...v3.2.1
[3.2.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.1.1...v3.2.0
[3.1.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.1.0...v3.1.1
[3.1.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v3.0.0...v3.1.0
[3.0.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v2.1.0...v3.0.0
[2.1.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v2.0.0...v2.1.0
[2.0.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.5.0...v2.0.0
[1.5.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.4.1...v1.5.0
[1.4.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.4.0...v1.4.1
[1.4.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.3.1...v1.4.0
[1.3.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.3.0...v1.3.1
[1.3.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.2.1...v1.3.0
[1.2.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.2.0...v1.2.1
[1.2.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.1.4...v1.2.0
[1.1.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.1.3...v1.1.4
[1.1.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.1.2...v1.1.3
[1.1.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.1.1...v1.1.2
[1.1.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.1.0...v1.1.1
[1.1.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.8...v1.1.0
[1.0.8]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.7...v1.0.8
[1.0.7]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.6...v1.0.7
[1.0.6]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.5...v1.0.6
[1.0.5]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.4...v1.0.5
[1.0.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.3...v1.0.4
[1.0.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.2...v1.0.3
[1.0.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.1...v1.0.2
[0.9.5]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.4...v0.9.5
[1.0.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v1.0.0...v1.0.1
[0.99.4-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.99.3.1-shield...v0.99.4-shield
[1.0.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.9...v1.0.0
[0.9.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.3...v0.9.4
[0.9.9]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.5...v0.9.9
[0.99.3.1-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.99.3-shield...v0.99.3.1-shield
[0.9.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.2...v0.9.3
[0.99.3-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.99.2-shield...v0.99.3-shield
[0.99.2-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.99.1-shield...v0.99.2-shield
[0.99.1-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.99.0-shield...v0.99.1-shield
[0.99.0-shield]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/shield-customization...v0.99.0-shield
[0.9.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.1...v0.9.2
[shield-customization]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.9...shield-customization
[0.8.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.8.0...v0.8.1
[0.9.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.9.0...v0.9.1
[0.9.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.8.1...v0.9.0
[0.8.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.7.4...v0.8.0
[0.7.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.7.3...v0.7.4
[0.7.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.7.2...v0.7.3
[0.7.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.7.1...v0.7.2
[0.7.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.7.0...0.7.1
[0.7.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.6.2...v0.7.0
[0.6.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.6.1...v0.6.2
[0.6.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.6.0...v0.6.1
[0.6.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.5.0...v0.6.0
[0.5.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.4.4...v0.5.0
[0.4.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.4.3...v0.4.4
[0.4.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.4.2...v0.4.3
[0.4.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.4.1...v0.4.2
[0.4.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.4.0...v0.4.1
[0.4.0]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.6...v0.4.0
[0.3.6]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.5...v0.3.6
[0.3.5]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.4...v0.3.5
[0.3.4]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.3...v0.3.4
[0.3.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.2...v0.3.3
[0.3.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3.1...v0.3.2
[0.3.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.3...v0.3.1
[0.3]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.2.1...v0.3
[0.2.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.2...v0.2.1
[0.2]: https://gitlab.nic.cz/turris/reforis/reforis/-/compare/v0.1...v0.2
[0.1]: https://gitlab.nic.cz/turris/reforis/reforis/-/tags/v0.1
