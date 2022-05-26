import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { db } from '~/utils/db.server';

type LoaderData = { id: number };

export const loader: LoaderFunction = async ({ params }) => {
  return { id: params.id };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = await form.get('id');
  await db.category.delete({
    where: { id: parseInt(id ? id.toString() : '') },
  });

  return redirect('/categories');
};

const DeleteCategoryPage = () => {
  const { id } = useLoaderData<LoaderData>();

  return (
    <Modal closeUrl="/categories" title="Borrar categoría">
      <p className="text-sm text-gray-500">
        Estas seguro que quieres borrar esta categoría?
      </p>
      <Form method="delete">
        <input type="hidden" name="id" value={id} />
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Link to="/categories" className="ml-2">
            <Button type="button" variant="white">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="danger">
            Si, borrar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DeleteCategoryPage;
