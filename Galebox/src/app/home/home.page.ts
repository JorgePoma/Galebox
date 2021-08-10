import { Component } from '@angular/core';
import { PostService } from "./post.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  posts:any =[]

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.postService.getPosts().subscribe(
      (res) => {
        this.posts = res
      }, 
      (err) => console.log(err)
      );
  }
}
