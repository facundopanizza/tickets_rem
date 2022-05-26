import type { Category } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import React from 'react';
import Button from '~/components/Button';
import Card from '~/components/Card';
import Table from '~/components/Table';
import { db } from '~/utils/db.server';
import formatDate from '~/utils/formatDate';

type LoaderData = { categories: Category[] };

export const loader: LoaderFunction = async () => {
  const categories = await db.category.findMany();

  return json({ categories });
};

const IndexCategoriesPage = () => {
  const { categories } = useLoaderData<LoaderData>();

  return (
    <Card>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Categorías</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link to="new">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                Nueva categoría
              </button>
            </Link>
          </div>
        </div>
        <Table
          columns={[
            { accessor: 'id', header: 'ID' },
            { accessor: 'name', header: 'Nombre' },
            { accessor: 'createdAt', header: 'Creada' },
            { accessor: 'updatedAt', header: 'Actualizada' },
            { accessor: 'actions', header: '' },
          ]}
          data={categories.map((category) => ({
            ...category,
            createdAt: formatDate(category.createdAt),
            updatedAt: formatDate(category.updatedAt),
            actions: (
              <div className="space-x-3">
                <Link to={`${category.id}/edit`}>
                  <Button variant="secondary">Editar</Button>
                </Link>
                <Link to={`${category.id}/delete`}>
                  <Button variant="danger">Borrar</Button>
                </Link>
              </div>
            ),
          }))}
        />

        <Outlet />
      </div>
    </Card>
  );
};

export default IndexCategoriesPage;
