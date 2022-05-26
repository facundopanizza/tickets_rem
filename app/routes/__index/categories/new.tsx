import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
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
    name: z.string().min(1, 'El nombre es requerido'),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());

  if (data.error) return validationError(data.error);
  const { name } = data.data;

  await db.category.create({ data: { name } });
  return redirect('/categories');
};

const NewTicketPage = () => {
  return (
    <Modal title="Nueva categoría" closeUrl="/categories">
      <ValidatedForm
        validator={validator}
        method="post"
        className="space-y-4 mt-4">
        <Input name="name" label="Name" type="text" />

        <Button fullwidth type="submit" variant="primary">
          Crear
        </Button>
      </ValidatedForm>
    </Modal>
  );
};

export default NewTicketPage;
