import { ContentStore, Content as ContentModel} from './content-store';
import { dislikeAction, likeAction, addContentAction } from './actions';
import { ContentService } from './content-service';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  selector: 'content',
  templateUrl: 'app/content.html',
  styleUrls: ['app/content.css'],
  providers: [ ContentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyInOut', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0.1,
          transform: 'translateX(-100%)'
        }),
        animate('0.5s ease-in'),
      ]),
      transition('* => void', [
        style({
          opacity: 0.1,
          transform: 'translateX(100%)'
        }),
        animate('0.5s ease-out'),
      ]),
    ])
  ],
})

export class Content {
  @Input()
  content: ContentModel;

  constructor(private store: ContentStore, private contentService: ContentService) { }

  // mock userId for now
  userId = '242';

  likeHandler(content) {
    this.store.dispatch(likeAction(content.id));
    this.contentService.likeContent(content.id, this.userId).subscribe(resp => {
      console.log(resp)
      let items = resp.items.slice(2,3);

      for (let item of items) {
        var title = item.title;
        var link = item.link;
        var summary = item.summary;
        this.store.dispatch(addContentAction(link, title, item.id, summary));
      }

    },err => {
      // Log errors if any
      console.log(err);
    })
  }

  dislikeHandler(content) {
    this.store.dispatch(dislikeAction(content.id));

    this.contentService.dislikeContent(content.id, this.userId).subscribe(resp => {
      console.log(resp)

      let items = resp.items.slice(3,4);

      for (let item of items) {
        var title = item.title;
        var link = item.link;
        var summary = item.summary;
        this.store.dispatch(addContentAction(link, title, item.id, summary));
      }

    },err => {
      // Log errors if any
      console.log(err);
    })

    // setTimeout( () => {}, 100 );
  }

  clickHandler(content) {
    this.contentService.clickContent(content.id, this.userId).subscribe(resp => {},err => {
      // Log errors if any
      console.log(err);
    })
  }
}
