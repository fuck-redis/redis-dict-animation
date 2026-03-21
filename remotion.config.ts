import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
Config.setFrameRate(30);
Config.setConcurrency(4);
