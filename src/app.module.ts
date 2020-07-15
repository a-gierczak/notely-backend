import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MorganMiddleware } from '@nest-middlewares/morgan';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    PostModule,
    TagModule,
    StorageModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(
      ':method :url :status :res[content-length] - :response-time ms',
    );
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
