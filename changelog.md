# Changelog

## 2025-10-21
### Added
- Fence geometry's definition
- Short-circuit logic for face culling(`Visibility: Default | Always` for blocks' faces)

## 2025-10-20

### Added
- Chunks' bounds display in debug mode

### Changed
- Migrate debug planes and wireframe into debug mode
- Debug planes will now be just for culled faces(front side)
- Code structure for geometries' definition

### Fixed
- Issue with stair blocks culling
- Blocks cannot be placed on a negative coords

## 2025-10-19

### Added
- Complex overlapping judging logic for face culling
- New debug module for culling logic

### Changed
- Code annotations and documentation

### Removed
- Unnecessary code during project purification

## 2025-10-18

### Added
- Feature to compare size of faces overlapping before culling

### Fixed
- Face culling self-culling issue

## 2025-10-17

### Added
- Slab block type with `options` parameter support
- Manual block placement functionality in the world
- Basic scene setup
- Chunk logic and face culling implementation
- Debug face to identify culled faces
- Block setting logic (`setBlock()`)

### Changed
- Refactored face corner definitions into separate modules
- Removed hardcoded blocks

### Fixed
- Issue with slab block sides

## 2025-10-16

### Added
- Initial project structure
- Basic project files
- README.md file
- Basic scene setup
- Chunk logic and face culling
- Debug face to identify culled faces
- Slab block type with `options` parameter

### Changed
- Code annotations

### Fixed
- Issue with slab block sides

## 2025-10-15

### Added
- Initial commit
- Project initialization
