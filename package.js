Package.describe({
  name: 'fleetingclouds:asyncwraptest',
  version: '0.0.1',
  summary: 'test a packages that wraps async functions as Meteor sync functions',
  git: 'https://github.com/FleetingClouds/asyncwraptest',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('asyncwraptest.js', ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('fleetingclouds:asyncwraptest', ['server']);
  api.addFiles('asyncwraptest-tests.js', ['server']);
});

Npm.depends({
  'swagger-client': '2.1.1'
});