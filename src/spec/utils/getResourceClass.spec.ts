import test from 'ava';

import { GenericFintocResource } from '../../lib/resources/genericFintocResource';
import { Link } from '../../lib/resources/link';
import { getResourceClass } from '../../lib/utils';

test('"getResourceClass" default valid resource', async (t) => {
  const resource = 'link';
  const klass = await getResourceClass(resource);
  t.is(klass, Link);
});

test('"getResourceClass" default invalid resource', async (t) => {
  const resource = 'this_resource_does_not_exist';
  const klass = await getResourceClass(resource);
  t.is(klass, GenericFintocResource);
});

test('"getResourceClass" ISO datetime resource', async (t) => {
  const resource = 'any_resource';
  const klass = await getResourceClass(resource, '2021-08-13T13:40:40.811Z');
  t.is(klass, Date);
});

test('"getResourceClass" string resource', async (t) => {
  const resource = 'any_resource';
  const klass = await getResourceClass(resource, 'test-value');
  t.is(klass, String);
});

test('"getResourceClass" number resource', async (t) => {
  const resource = 'any_resource';
  const klass = await getResourceClass(resource, 15);
  t.is(klass, Number);
});

test('"getResourceClass" boolean resource', async (t) => {
  const resource = 'any_resource';
  const klass = await getResourceClass(resource, true);
  t.is(klass, Boolean);
});
