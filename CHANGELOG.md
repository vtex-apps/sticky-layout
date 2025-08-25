# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed 
- Prevents content overlap and layout shifting on the initial component load. [Vtex Request #1280105](https://support.vtex.com/hc/en-us/requests/1280105)

## [0.3.4] - 2020-08-10
### Fixed
- Prevents initial overlap with content, which also prevents layout shift once the component loads.

## [0.3.3] - 2020-03-03
### Fixed
- Elements at the top of the page must have the `stuck` class removed when scrolled back to the top.

## [0.3.2] - 2020-02-13
### Fixed
- Update cached wrapper `offsetTop` when resizing the window.

## [0.3.1] - 2020-02-10
### Fixed
- Build failing.

## [0.3.0] - 2020-02-10
### Added
- `sticky-layout.stack-container` block to handle stacking behavior.

## [0.2.0] - 2020-01-22

### Fixed

- Bottom behavior was janky and sometimes stuck in the middle of the screen

### Added

- `TOP` position to be fixed in the top of the screen
- `verticalSpacing` to reflect the distance of the selected position

## [0.1.4] - 2019-10-07

## [0.1.3] - 2019-08-29

## [0.1.2] - 2019-07-29
### Fixed
- Avoid setting the start top in a custom ref, always get it from the div ref.

## [0.1.1] - 2019-07-22
### Fixed
- Fix component top calculation for when base element has top styled changed by external component.

## [0.1.0] - 2019-07-10
### Added
- First commit.

- **Component** Create the VTEX Store Component Sticky Layout
