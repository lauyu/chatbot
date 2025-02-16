import {Mutex, tryAcquire, E_ALREADY_LOCKED} from 'async-mutex';

class Selector {
  private static instance: Selector;
  private mutex: Mutex;
  private appKey: string[];

  private constructor() {
    this.mutex = new Mutex();
    this.appKey = process.env.ANTHROPIC_APPKEY?.split(',') || [];
  }

  public static getInstance(): Selector {
    if (!Selector.instance) {
      Selector.instance = new Selector();
    }
    return Selector.instance;
  }

  public async select(model: string): Promise<string | null> {
    const release = await this.mutex.acquire();
    try {
      if("Anthropic"===model) {
        if(this.appKey.length === 0) {
          return null
        }
        let selectedItem = this.appKey.shift()!;
        this.appKey.push(selectedItem);
        return selectedItem

      }
      throw new Error("Could not find any selected item");

    } finally {
      release();
    }
  }
}

export default Selector;