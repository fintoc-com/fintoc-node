import test from 'ava';

import { GenericFintocResource, Link } from '../../lib/resources';
import { getResourceClass } from '../../lib/utils';

test('"getResourceClass" default valid resource', (t) => {
  const resource = 'link';
  const klass = getResourceClass(resource);
  t.is(klass, Link);
});

test('"getResourceClass" default invalid resource', (t) => {
  const resource = 'this_resource_does_not_exist';
  const klass = getResourceClass(resource);
  t.is(klass, GenericFintocResource);
});

test('"getResourceClass" ISO datetime resource', (t) => {
  const resource = 'any_resource';
  const klass = getResourceClass(resource, '2021-08-13T13:40:40.811Z');
  t.is(klass, Date);
});

test('"getResourceClass" string resource', (t) => {
  const resource = 'any_resource';
  const klass = getResourceClass(resource, 'test-value');
  t.is(klass, String);
});

test('"getResourceClass" number resource', (t) => {
  const resource = 'any_resource';
  const klass = getResourceClass(resource, 15);
  t.is(klass, Number);
});

test('"getResourceClass" boolean resource', (t) => {
  const resource = 'any_resource';
  const klass = getResourceClass(resource, true);
  t.is(klass, Boolean);
});
