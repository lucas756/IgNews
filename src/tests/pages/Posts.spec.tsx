
import { mocked } from 'ts-jest/utils';

import { render, screen } from '@testing-library/react';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/primsic';

const posts = [
    { slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de abril' }
]

jest.mock('../../services/primsic')

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My New Post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post Excerpt' }
                            ]
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining(
                {
                    props: {
                        posts: [{
                            slug: 'my-new-post',
                            title: 'My New Post',
                            excerpt: 'Post Excerpt',
                            updatedAt: '01 de abril de 2021'
                        }]
                    }
                }
            )
        )
    })
})