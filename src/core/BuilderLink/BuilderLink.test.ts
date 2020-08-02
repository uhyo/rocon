import { BuilderLink } from ".";
import { PathLocationComposer } from "../../builder/composers/PathLocationComposer";
import { PathRouteBuilder } from "../../builder/PathRouteBuilder";
import { SearchRouteBuilder } from "../../builder/SearchRouteBuilder";

// TODO: rewrite this test
const composer = new PathLocationComposer();

describe("BuilderLink", () => {
  describe("attachToParent", () => {
    it("cannot attach twice", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });
      const b2 = PathRouteBuilder.init().routes({
        bar: { action: () => "bar" },
      });

      link.attachToParent(b1.getBuilderLink(), () => "bar");
      expect(() =>
        link.attachToParent(b2.getBuilderLink(), () => "bar")
      ).toThrow();
    });
    it("cannot inherit twice", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });
      // attach
      link.attachToParent(b1.getBuilderLink(), () => "foo");
      link.inherit();

      expect(() => link.inherit()).toThrow();
    });
    it("checkInvalidation", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });

      // attach
      link.attachToParent(b1.getBuilderLink(), () => "foo");
      link.inherit();

      expect(() => link.checkInvalidation()).toThrow();
    });
    it("inherited links have same RouteResolver", () => {
      const parent = SearchRouteBuilder.init("foo");
      const link1 = new BuilderLink({ composer });
      parent.attach(link1);

      const link2 = link1.inherit();

      expect(link1.resolver).toBe(link2.resolver);
    });
    describe("attached links have same RouteResolver", () => {
      it("simple", () => {
        const parent = SearchRouteBuilder.init("foo");
        const link1 = parent.getBuilderLink();

        const link2 = new BuilderLink({
          composer,
        });

        link2.attachToParent(
          parent.getBuilderLink(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (match) => (match as any).foo
        );
        expect(link1.resolver).toBe(link2.resolver);
      });
    });
  });
  describe("getParentLinkAndSegmentGetter", () => {
    it("unattached", () => {
      const link = new BuilderLink({
        composer,
      });

      expect(link.getParentLinkAndSegmentGetter()).toBeUndefined();
    });
    it("attached", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });

      const getter = () => "foo";
      link.attachToParent(b1.getBuilderLink(), getter);

      expect(link.getParentLinkAndSegmentGetter()).toEqual([
        getter,
        b1.getBuilderLink(),
      ]);
    });
    it("inherited", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });

      const getter = () => "foo";
      link.attachToParent(b1.getBuilderLink(), getter);
      link.inherit();

      expect(link.getParentLinkAndSegmentGetter()).toEqual([
        getter,
        b1.getBuilderLink(),
      ]);
    });
    it("attach-inherit", () => {
      const link = new BuilderLink({
        composer,
      });

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });

      const getter = () => "foo";
      link.attachToParent(b1.getBuilderLink(), getter);
      const link2 = link.inherit();

      expect(link2.getParentLinkAndSegmentGetter()).toEqual([
        getter,
        b1.getBuilderLink(),
      ]);
    });
    it("unattached-inherited", () => {
      const link = new BuilderLink({
        composer,
      });

      const link2 = link.inherit();

      const b1 = PathRouteBuilder.init().routes({
        foo: { action: () => "foo" },
      });

      const getter = () => "foo";

      link2.attachToParent(b1.getBuilderLink(), getter);

      expect(link.getParentLinkAndSegmentGetter()).toBeUndefined();
    });
  });
});
