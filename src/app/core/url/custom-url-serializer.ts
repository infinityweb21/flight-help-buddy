import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class CustomUrlSerializer extends DefaultUrlSerializer {
  override serialize(tree: UrlTree): string {
    // This looks at the final URL string and converts %2F back to /
    return super.serialize(tree).replace(/%2F/g, '/');
  }
}