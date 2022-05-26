import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import React from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import { db } from '~/utils/db.server';

export const validator = withZod(
  z.object({
    id: z.string().min(1, 'El id es requerido'),
    name: z.string().min(1, 'El nombre es requerido'),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const data = await validator.validate(form);

  if (data.error) return validationError(data.error);
  const { id, name } = data.data;

  await db.category.update({
    data: { name },
    where: { id: parseInt(id ? id : '') },
  });
  return redirect('/categories');
};

type LoaderData = { name: string; id: number };

export const loader: LoaderFunction = async ({ params }) => {
  const category = await db.category.findFirst({
    where: { id: parseInt(params.id ? params.id : '') },
    select: { name: true, id: true },
  });

  if (!category) return redirect('/categories');

  return json({ name: category.name, id: category.id });
};

const EditCategoryPage = () => {
  const { name, id } = useLoaderData<LoaderData>();
  return (
    <Modal closeUrl="/categories" title="Editar categoría">
      <ValidatedForm validator={validator} className="space-y-4" method="patch">
        <input type="hidden" name="id" value={id} />
        <div className="mt-4">
          <Input name="name" label="Nombre" type="text" defaultValue={name} />
        </div>

        <Button fullwidth variant="primary" type="submit">
          Editar
        </Button>
      </ValidatedForm>
    </Modal>
  );
};

export default EditCategoryPage;
