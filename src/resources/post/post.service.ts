import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';
import PeopleModel from '@/resources/people/people.model';

class PostService {
    private post = PostModel;
    private people = PeopleModel;
    /**
     * Create a new post
     */
    public async create(title: string, body: string): Promise<Post> {
        try {
            const post = await this.post.create({ title, body });
            // const result = await this.post.find().count();

            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }
}

export default PostService;
