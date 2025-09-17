
import React, { useRef, useEffect, useState } from 'react';

// A simple Vector class for 2D math
class Vector {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n: number) {
    this.x /= n;
    this.y /= n;
    return this;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.mag();
    if (len !== 0) this.mult(1 / len);
    return this;
  }

  setMag(n: number) {
    return this.normalize().mult(n);
  }

  limit(max: number) {
    const mSq = this.mag() * this.mag();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)).mult(max);
    }
    return this;
  }

  static sub(v1: Vector, v2: Vector) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
}

class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxForce: number;
  maxSpeed: number;
  color: string;
  size: number;
  scattering: boolean;
  scatterTimer: number;

  constructor(x: number, y: number, color: string) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    this.acceleration = new Vector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.color = color;
    this.size = 3;
    this.scattering = false;
    this.scatterTimer = 0;
  }

  edges(width: number, height: number) {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  applyForce(force: Vector) {
    this.acceleration.add(force);
  }

  // Steer towards the average heading of local flockmates
  align(boids: Boid[]) {
    const perceptionRadius = 50;
    const steering = new Vector();
    let total = 0;
    for (const other of boids) {
      const d = Vector.sub(other.position, this.position).mag();
      if (other !== this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  // Steer towards the average position of local flockmates
  cohesion(boids: Boid[]) {
    const perceptionRadius = 100;
    const steering = new Vector();
    let total = 0;
    for (const other of boids) {
      const d = Vector.sub(other.position, this.position).mag();
      if (other !== this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  // Steer to avoid crowding local flockmates
  separation(boids: Boid[]) {
    const perceptionRadius = 40;
    const steering = new Vector();
    let total = 0;
    for (const other of boids) {
      const d = Vector.sub(this.position, other.position).mag();
      if (other !== this && d < perceptionRadius) {
        const diff = Vector.sub(this.position, other.position);
        diff.div(d * d); // Weight by distance
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  // Steer towards a target and slow down on approach
  arrive(target: Vector) {
    const desired = Vector.sub(target, this.position);
    const d = desired.mag();
    const arrivalRadius = 150; // Radius to start slowing down
    
    if (d < arrivalRadius) {
      const speed = (d / arrivalRadius) * this.maxSpeed;
      desired.setMag(speed);
    } else {
      desired.setMag(this.maxSpeed);
    }

    const steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  // Steer away from a target
  flee(target: Vector) {
    const desired = Vector.sub(this.position, target);
    const d = desired.mag();
    if (d > 0) {
        desired.setMag(this.maxSpeed);
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }
    return new Vector(0, 0);
  }

  flock(boids: Boid[], mouse: Vector | null) {
    const alignment = this.align(boids);
    const cohesionForce = this.cohesion(boids);
    const separationForce = this.separation(boids);
    
    // Apply flocking forces
    this.applyForce(alignment);
    this.applyForce(cohesionForce);
    this.applyForce(separationForce);

    // Handle scattering state timer
    if (this.scatterTimer > 0) {
        this.scatterTimer--;
    } else {
        this.scattering = false;
    }

    // Apply cursor interaction force
    if(mouse) {
        const d = Vector.sub(this.position, mouse).mag();
        const touchRadius = 25; // How close to the cursor to trigger scattering
        const scatterDuration = 80; // How many frames to scatter for

        // If boid touches the cursor, trigger scattering
        if (d < touchRadius) {
            this.scattering = true;
            this.scatterTimer = scatterDuration;
        }

        if (this.scattering) {
            const fleeForce = this.flee(mouse);
            fleeForce.mult(5); // Make the flee force strong
            this.applyForce(fleeForce);
        } else {
            const arriveForce = this.arrive(mouse);
            arriveForce.mult(0.5); // Adjust this weight for desired attraction strength
            this.applyForce(arriveForce);
        }
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration each frame
  }

  draw(ctx: CanvasRenderingContext2D) {
    const angle = Math.atan2(this.velocity.y, this.velocity.x);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(this.size, 0);
    ctx.lineTo(-this.size, this.size / 2);
    ctx.lineTo(-this.size, -this.size / 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accentColor, setAccentColor] = useState('hsl(154, 13%, 48%)');

  // Effect to update color based on theme
  useEffect(() => {
    const updateColor = () => {
      // Read the CSS variable from the root element
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim();
      // The value is in HSL components, so we build the hsl string
      setAccentColor(`hsl(${color})`);
    };

    updateColor(); // Initial color set

    // Observe changes to the class attribute of the <html> element
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateColor();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Effect to manage canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let flock: Boid[];
    
    const mouse = {
        vector: null as Vector | null
    };

    const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        if(!mouse.vector) mouse.vector = new Vector();
        mouse.vector.x = event.clientX - rect.left;
        mouse.vector.y = event.clientY - rect.top;
    };
    
    const handleMouseOut = () => {
        mouse.vector = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      flock = [];
      const numberOfBoids = Math.min(60, (canvas.width * canvas.height) / 10000);
      for (let i = 0; i < numberOfBoids; i++) {
        flock.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, accentColor));
      }
    };
    
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const boid of flock) {
        boid.edges(canvas.width, canvas.height);
        boid.flock(flock, mouse.vector);
        boid.update();
        boid.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        cancelAnimationFrame(animationFrameId);
        init();
        animate();
      };
  
    init();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    };
  }, [accentColor]); // Re-run effect when accentColor changes

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default InteractiveBackground;
