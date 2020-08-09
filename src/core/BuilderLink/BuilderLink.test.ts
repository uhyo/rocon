import { BuilderLink } from ".";
import { PathLocationComposer } from "../../builder/composers/PathLocationComposer";

const composer = new PathLocationComposer();

describe("BuilderLink", () => {
  describe("attachToParent", () => {
    it("cannot attach twice", () => {
      const link = new BuilderLink({
        composer,
      });

      const link2 = new BuilderLink({ composer });
      const link3 = new BuilderLink({ composer });

      link.attachToParent(link2, () => "bar");
      expect(() => link.attachToParent(link3, () => "bar")).toThrow();
    });
    it("cannot inherit twice", () => {
      const link = new BuilderLink({
        composer,
      });

      const childLink = new BuilderLink({ composer });
      // attach
      link.attachToParent(childLink, () => "foo");
      link.inherit();

      expect(() => link.inherit()).toThrow();
    });
    it("checkInvalidation", () => {
      const link = new BuilderLink({
        composer,
      });

      const parent = new BuilderLink({ composer });

      // attach
      link.attachToParent(parent, () => "foo");
      link.inherit();

      expect(() => link.checkInvalidation()).toThrow();
    });
    it("inherited links have same RouteResolver", () => {
      const parent = new BuilderLink({ composer });
      const link1 = new BuilderLink({ composer });
      link1.attachToParent(parent, () => "foo");

      const link2 = link1.inherit();

      expect(link1.resolver).toBe(link2.resolver);
    });
    describe("attached links have same RouteResolver", () => {
      it("simple", () => {
        const link1 = new BuilderLink({ composer });

        const link2 = new BuilderLink({
          composer,
        });

        link2.attachToParent(
          link1,
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

      const parent = new BuilderLink({ composer });

      const getter = () => "foo";
      link.attachToParent(parent, getter);

      expect(link.getParentLinkAndSegmentGetter()).toEqual([getter, parent]);
    });
    it("inherited", () => {
      const link = new BuilderLink({
        composer,
      });

      const parent = new BuilderLink({ composer });

      const getter = () => "foo";
      link.attachToParent(parent, getter);
      link.inherit();

      expect(link.getParentLinkAndSegmentGetter()).toEqual([getter, parent]);
    });
    it("attach-inherit", () => {
      const link = new BuilderLink({
        composer,
      });

      const parent = new BuilderLink({ composer });

      const getter = () => "foo";
      link.attachToParent(parent, getter);
      const link2 = link.inherit();

      expect(link2.getParentLinkAndSegmentGetter()).toEqual([getter, parent]);
    });
    it("unattached-inherited", () => {
      const link = new BuilderLink({
        composer,
      });

      const link2 = link.inherit();

      const parent = new BuilderLink({ composer });

      const getter = () => "foo";

      link2.attachToParent(parent, getter);

      expect(link.getParentLinkAndSegmentGetter()).toEqual([getter, parent]);
    });
  });
});
