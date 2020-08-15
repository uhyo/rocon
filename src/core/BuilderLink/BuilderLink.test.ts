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
  });
});
