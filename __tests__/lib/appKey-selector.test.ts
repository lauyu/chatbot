import Selector from "@/lib/chat/appKey-selector"
import { loadEnvConfig } from '@next/env';


describe('My Test Suite', () => {
  beforeAll(() => {
    // 加载测试环境变量
    loadEnvConfig(process.cwd(), './env.test');
  });
  it('should select the correct values from Anthropic', async () => {
    const split = process.env.ANTHROPIC_APPKEY.split(',');
    for (let i = 0; i < split.length * 2 - 1; i++) {
      const select1 = await Selector.getInstance().select("Anthropic");
      console.log(`${i}, ${select1}, ${split[i % split.length]}`);
      expect(select1).toEqual(split[i % split.length]);
    }
  }, 10000);
});