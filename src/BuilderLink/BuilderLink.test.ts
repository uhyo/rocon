import { BuilderLink } from ".";
import { PathLocationComposer } from "../LocationComposer/PathLocationComposer";
import { PathRoutesBuilder } from "../RouteBuilder/PathRoutesBuilder";

const composer = new PathLocationComposer();

describe("BuilderLink", () => {
  describe("attachToParent", () => {
    it("cannot attach twice", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();
      const parent2 = PathRoutesBuilder.init()
        .routes({
          bar: { action: () => "bar" },
        })
        .getRoutes();

      link.attachToParent(parent1.foo);
      expect(() => link.attachToParent(parent2.bar)).toThrow();
    });
    it("cannot inherit twice", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();
      // attach
      link.attachToParent(parent1.foo);
      link.inherit();

      expect(() => link.inherit()).toThrow();
    });
    it("checkInvalidation", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();
      // attach
      link.attachToParent(parent1.foo);
      link.inherit();

      expect(() => link.checkInvalidation()).toThrow();
    });
  });
  describe("getParentRoute", () => {
    it("unattached", () => {
      const link = BuilderLink.init({
        composer,
      });

      expect(link.getParentRoute()).toBeUndefined();
    });
    it("attached", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();

      link.attachToParent(parent1.foo);

      expect(link.getParentRoute()).toBe(parent1.foo);
    });
    it("inherited", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();

      link.attachToParent(parent1.foo);
      link.inherit();

      expect(link.getParentRoute()).toBe(parent1.foo);
    });
    it("attach-inherit", () => {
      const link = BuilderLink.init({
        composer,
      });

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();

      link.attachToParent(parent1.foo);
      const link2 = link.inherit();

      expect(link2.getParentRoute()).toBe(parent1.foo);
    });
    it("unattached-inherited", () => {
      const link = BuilderLink.init({
        composer,
      });

      const link2 = link.inherit();

      const parent1 = PathRoutesBuilder.init()
        .routes({
          foo: { action: () => "foo" },
        })
        .getRoutes();

      link2.attachToParent(parent1.foo);

      expect(link.getParentRoute()).toBeUndefined();
    });
  });
});
