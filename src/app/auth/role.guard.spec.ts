import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser: { role: 'Admin' }
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    route = new ActivatedRouteSnapshot();

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should allow access when role matches', () => {
    route.data = { roles: ['Admin'] };
    expect(guard.canActivate(route)).toBeTrue();
  });

  it('should block access and redirect when role does not match', () => {
    Object.defineProperty(authServiceSpy, 'currentUser', {
      get: () => ({ role: 'User' })
    });
    route.data = { roles: ['Admin'] };
    expect(guard.canActivate(route)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});