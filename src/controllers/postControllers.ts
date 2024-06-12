import { Request, Response } from 'express';
import { PostRepository } from '../index';
import { AddPostInterface, FindPostInterface, GetPostsInterface } from '../types/PostRepositoryInterface';
import { checkMissingFields } from '../utils/helpers';
import { postFieldErrors } from '../utils/constants/FieldErrors';
import { PostEntity } from '../classes/PostEntity';

export class GetPostsController {
  constructor(private postRepository: GetPostsInterface) {}

  async getAllPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const posts = await this.postRepository.getPosts()
      res.send(posts);
    }
    catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const getPostsHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new GetPostsController(PostRepository).getAllPosts(req, res);
};

export class FindPostController {
  constructor(private postRepository: FindPostInterface) {}

  async findPost(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const { id } = req.params;
      const post = await this.postRepository.findPost(parseInt(id))
      if(!post) {
        return res.status(400).send('Post not found!');
      }
      res.send(post);
    }
    catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const findPostHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new FindPostController(PostRepository).findPost(req, res);
};

export class AddPostController {
  constructor(private postRepository: AddPostInterface) {}

  async addPost(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const { title, description } = req.body;
    const fieldsFromReq = {
      title,
      description,
    };
    try {
      const missingCreds = checkMissingFields(fieldsFromReq, postFieldErrors);
      if (missingCreds.length > 0) {
        return res.status(400).send(missingCreds);
      }
      const newPost = new PostEntity;
      Object.assign(newPost, fieldsFromReq);

      newPost.title = title
      newPost.description = description
      const addPostToDb = await this.postRepository.addPost(newPost)
      return res.status(200).send('Thank you for posting!').end();
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const addPostHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new AddPostController(PostRepository).addPost(req, res);
};